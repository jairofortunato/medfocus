/**
 * Spaced Repetition — pure logic (no DB calls).
 * All date strings are ISO format: YYYY-MM-DD.
 */

// ============================================================
// Types
// ============================================================

export interface SRCard {
  id?: string;
  user_id: string;
  area: string;
  subtopico: string;
  next_review_at: string;
  interval_days: number;
  excellent_streak: number;
  last_performance_pct: number | null;
  total_sessions: number;
  status: 'new' | 'learning' | 'review' | 'mastered';
  created_at?: string;
  updated_at?: string;
}

export interface ScheduledReview {
  id?: string;
  user_id: string;
  area: string;
  subtopico: string;
  scheduled_date: string;
  status: 'pending' | 'completed' | 'missed';
  completed_at?: string;
  performance_pct?: number | null;
}

export interface StudyPlanConfig {
  id?: string;
  user_id: string;
  days_of_week: number[]; // 0=Sun, 1=Mon ... 6=Sat
  subjects_per_day: number;
  questions_per_day: number;
}

export interface SubtopicoWithHistory {
  area: string;
  subtopico: string;
  /** null = never studied before */
  performancePct: number | null;
  /** total questions available in the bank for this subtopico */
  questionCount: number;
}

// ============================================================
// Residency group mapping (5 grandes áreas da residência)
// ============================================================

export const RESIDENCY_GROUPS: Record<string, string> = {
  'Cardiologia': 'Clínica Médica',
  'Pneumologia': 'Clínica Médica',
  'Infectologia': 'Clínica Médica',
  'Gastroenterologia / Hepatologia': 'Clínica Médica',
  'Nefrologia': 'Clínica Médica',
  'Reumatologia': 'Clínica Médica',
  'Endocrinologia': 'Clínica Médica',
  'Neurologia': 'Clínica Médica',
  'Psiquiatria': 'Clínica Médica',
  'Hematologia': 'Clínica Médica',
  'Oncologia': 'Clínica Médica',
  'Dermatologia': 'Clínica Médica',
  'Urologia': 'Clínica Médica',
  'Cirurgia Geral': 'Cirurgia',
  'Ortopedia / Traumatologia': 'Cirurgia',
  'Medicina de Urgência e Terapia Intensiva': 'Cirurgia',
  'Otorrinolaringologia': 'Cirurgia',
  'Oftalmologia': 'Cirurgia',
  'Ginecologia e Obstetrícia': 'Ginecologia e Obstetrícia',
  'Pediatria': 'Pediatria',
  'Medicina Preventiva / Saúde Coletiva': 'Medicina Preventiva',
};

export const RESIDENCY_AREAS = [
  'Clínica Médica',
  'Cirurgia',
  'Ginecologia e Obstetrícia',
  'Pediatria',
  'Medicina Preventiva',
] as const;

export type ResidencyArea = typeof RESIDENCY_AREAS[number];

// ============================================================
// Date utilities
// ============================================================

/** Today as YYYY-MM-DD */
export function today(): string {
  return new Date().toISOString().split('T')[0];
}

/** Add N days to a date string, return YYYY-MM-DD */
export function addDays(date: string, days: number): string {
  const d = new Date(date + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().split('T')[0];
}

/**
 * Return the first N calendar dates >= startDate that fall on one of daysOfWeek.
 * daysOfWeek uses JS convention: 0=Sun, 1=Mon ... 6=Sat.
 */
export function getStudyDates(
  startDate: string,
  daysOfWeek: number[],
  count: number,
): string[] {
  const dates: string[] = [];
  const d = new Date(startDate + 'T12:00:00Z');
  const dow = new Set(daysOfWeek);
  // Safety: max 2 years of iteration
  let iterations = 0;
  while (dates.length < count && iterations < 730) {
    if (dow.has(d.getUTCDay())) {
      dates.push(d.toISOString().split('T')[0]);
    }
    d.setUTCDate(d.getUTCDate() + 1);
    iterations++;
  }
  return dates;
}

// ============================================================
// Interval algorithm
// ============================================================

export interface IntervalResult {
  intervalDays: number;
  newExcellentStreak: number;
  newStatus: SRCard['status'];
}

export function calculateNextInterval(
  performancePct: number,
  currentExcellentStreak: number,
): IntervalResult {
  if (performancePct < 50) {
    return { intervalDays: 3, newExcellentStreak: 0, newStatus: 'learning' };
  }
  if (performancePct < 75) {
    return { intervalDays: 7, newExcellentStreak: 0, newStatus: 'learning' };
  }
  if (performancePct < 90) {
    return { intervalDays: 12, newExcellentStreak: 0, newStatus: 'review' };
  }

  // Excellent (>= 90%)
  const newStreak = currentExcellentStreak + 1;
  const intervalDays = newStreak === 1 ? 21 : newStreak === 2 ? 45 : 90;
  const newStatus: SRCard['status'] = newStreak >= 3 ? 'mastered' : 'review';
  return { intervalDays, newExcellentStreak: newStreak, newStatus };
}

/** Human-readable label for a performance percentage */
export function performanceLabel(pct: number): string {
  if (pct < 50) return 'Ruim';
  if (pct < 75) return 'Médio';
  if (pct < 90) return 'Bom';
  return 'Excelente';
}

// ============================================================
// Initial plan generation
// ============================================================

/**
 * Generates the initial set of sr_cards and scheduled_reviews for a new plan.
 *
 * Strategy — strict 20% per residency group:
 * - Pre-generate a slot sequence using round-robin across the 5 groups.
 *   e.g. with subjects_per_day=2: slots = [CM, Cir, GO, Ped, Prev, CM, Cir, ...]
 *   Each study day consumes N consecutive slots from this sequence.
 * - For each (date, group) slot, pop the most urgent item from that group's queue.
 * - If the assigned group has no items ready, fall back to any group with items.
 * This guarantees exactly 20% per group in the long run.
 */
export function generateInitialSchedule(
  userId: string,
  subtopicos: SubtopicoWithHistory[],
  config: Pick<StudyPlanConfig, 'days_of_week' | 'subjects_per_day'>,
  startDate: string,
): { cards: Omit<SRCard, 'id' | 'created_at' | 'updated_at'>[]; reviews: Omit<ScheduledReview, 'id' | 'created_at'>[] } {
  interface QueueItem extends SubtopicoWithHistory {
    earliestDate: string;
    intervalDays: number;
    excellentStreak: number;
    status: SRCard['status'];
  }

  // Build sorted queue per group: worst performers first, then new items
  const groupQueues: Record<string, QueueItem[]> = {};
  for (const g of RESIDENCY_AREAS) groupQueues[g] = [];

  for (const sub of subtopicos) {
    const group = RESIDENCY_GROUPS[sub.area] ?? 'Clínica Médica';
    let intervalDays = 1;
    let excellentStreak = 0;
    let status: SRCard['status'] = 'new';
    let earliestDate = startDate;

    if (sub.performancePct !== null) {
      const calc = calculateNextInterval(sub.performancePct, 0);
      intervalDays = calc.intervalDays;
      excellentStreak = calc.newExcellentStreak;
      status = calc.newStatus;
      earliestDate = addDays(startDate, intervalDays);
    }

    groupQueues[group].push({ ...sub, earliestDate, intervalDays, excellentStreak, status });
  }

  for (const g of RESIDENCY_AREAS) {
    groupQueues[g].sort((a, b) => {
      // 1. Worst performers first (have history)
      // 2. New items (no history) sorted by questionCount DESC — more questions = earlier
      const aNew = a.performancePct === null;
      const bNew = b.performancePct === null;

      if (!aNew && !bNew) return a.performancePct! - b.performancePct!; // worst first
      if (!aNew && bNew) return -1; // history items before new
      if (aNew && !bNew) return 1;
      // Both new: more questions in bank = higher priority
      return b.questionCount - a.questionCount;
    });
  }

  // Pre-generate a flat slot-group sequence via strict round-robin:
  // [CM, Cir, GO, Ped, Prev, CM, Cir, GO, Ped, Prev, ...]
  // Each position = which group owns that slot.
  const totalSubs = subtopicos.length;
  const totalSlots = totalSubs + 50; // a bit extra
  const slotGroups: string[] = [];
  for (let i = 0; i < totalSlots; i++) {
    slotGroups.push(RESIDENCY_AREAS[i % RESIDENCY_AREAS.length]);
  }

  // Generate enough study dates
  const datesNeeded = Math.ceil(totalSubs / config.subjects_per_day) + 120;
  const studyDates = getStudyDates(startDate, config.days_of_week, datesNeeded);

  const cards: Omit<SRCard, 'id' | 'created_at' | 'updated_at'>[] = [];
  const reviews: Omit<ScheduledReview, 'id' | 'created_at'>[] = [];

  // Track last date each subtopico name was scheduled (to prevent same name within 7 days)
  const lastScheduledDate = new Map<string, string>();

  let slotIdx = 0; // pointer into slotGroups

  for (const date of studyDates) {
    const usedGroupsToday = new Set<string>();

    for (let s = 0; s < config.subjects_per_day; s++) {
      if (slotIdx >= slotGroups.length) break;

      // Determine which group this slot belongs to
      let targetGroup = slotGroups[slotIdx];
      slotIdx++;

      // Helper: check if an item's subtopico name was used within the last 6 days
      const recentlyUsed = (item: QueueItem) => {
        const last = lastScheduledDate.get(item.subtopico);
        if (!last) return false;
        const daysDiff = (new Date(date + 'T12:00:00Z').getTime() - new Date(last + 'T12:00:00Z').getTime()) / 86400000;
        return daysDiff < 7;
      };

      // Find an item from the target group that is ready (earliestDate <= date)
      // and whose group is not already used today
      let chosenGroup: string | null = null;
      let chosenIdx = -1;

      // Try target group first (not already used today)
      if (!usedGroupsToday.has(targetGroup)) {
        const idx = groupQueues[targetGroup].findIndex((item) => item.earliestDate <= date && !recentlyUsed(item));
        if (idx !== -1) {
          chosenGroup = targetGroup;
          chosenIdx = idx;
        }
      }

      // If target not available, try other groups not yet used today (preserve round-robin balance)
      if (chosenGroup === null) {
        for (const g of RESIDENCY_AREAS) {
          if (usedGroupsToday.has(g)) continue;
          const idx = groupQueues[g].findIndex((item) => item.earliestDate <= date && !recentlyUsed(item));
          if (idx !== -1) {
            chosenGroup = g;
            chosenIdx = idx;
            break;
          }
        }
      }

      // Last resort: any group with items (allow repeat group on same day), still avoiding recent names
      if (chosenGroup === null) {
        for (const g of RESIDENCY_AREAS) {
          const idx = groupQueues[g].findIndex((item) => item.earliestDate <= date && !recentlyUsed(item));
          if (idx !== -1) {
            chosenGroup = g;
            chosenIdx = idx;
            break;
          }
        }
      }

      // Final fallback: ignore the 7-day name constraint if nothing else fits
      if (chosenGroup === null) {
        for (const g of RESIDENCY_AREAS) {
          const idx = groupQueues[g].findIndex((item) => item.earliestDate <= date);
          if (idx !== -1) {
            chosenGroup = g;
            chosenIdx = idx;
            break;
          }
        }
      }

      if (chosenGroup === null || chosenIdx === -1) continue;

      const [item] = groupQueues[chosenGroup].splice(chosenIdx, 1);
      usedGroupsToday.add(chosenGroup);
      lastScheduledDate.set(item.subtopico, date);

      cards.push({
        user_id: userId,
        area: item.area,
        subtopico: item.subtopico,
        next_review_at: date,
        interval_days: item.intervalDays,
        excellent_streak: item.excellentStreak,
        last_performance_pct: item.performancePct,
        total_sessions: item.performancePct !== null ? 1 : 0,
        status: item.status,
      });

      reviews.push({
        user_id: userId,
        area: item.area,
        subtopico: item.subtopico,
        scheduled_date: date,
        status: 'pending',
      });
    }

    // Check if all queues are empty
    const anyLeft = RESIDENCY_AREAS.some((g) => groupQueues[g].length > 0);
    if (!anyLeft) break;
  }

  return { cards, reviews };
}

// ============================================================
// Post-session update
// ============================================================

export interface SessionResult {
  updatedCard: Omit<Partial<SRCard>, 'id' | 'user_id' | 'area' | 'subtopico'>;
  nextReview: Omit<ScheduledReview, 'id'>;
}

/**
 * Given a completed session result, returns the fields to update on sr_cards
 * and the new scheduled_review to insert.
 */
export function processSessionResult(
  card: SRCard,
  performancePct: number,
  sessionDate: string,
  config: Pick<StudyPlanConfig, 'days_of_week' | 'subjects_per_day'>,
): SessionResult {
  const { intervalDays, newExcellentStreak, newStatus } = calculateNextInterval(
    performancePct,
    card.excellent_streak,
  );

  // Find the next available study date on or after the calculated date
  const earliestNext = addDays(sessionDate, intervalDays);
  const futureDates = getStudyDates(earliestNext, config.days_of_week, 30);
  const nextDate = futureDates[0] ?? earliestNext;

  return {
    updatedCard: {
      next_review_at: nextDate,
      interval_days: intervalDays,
      excellent_streak: newExcellentStreak,
      last_performance_pct: performancePct,
      total_sessions: card.total_sessions + 1,
      status: newStatus,
    },
    nextReview: {
      user_id: card.user_id,
      area: card.area,
      subtopico: card.subtopico,
      scheduled_date: nextDate,
      status: 'pending',
    },
  };
}

// ============================================================
// Calendar helpers
// ============================================================

/** Group scheduled reviews by date for calendar rendering */
export function groupReviewsByDate(
  reviews: ScheduledReview[],
): Record<string, ScheduledReview[]> {
  const map: Record<string, ScheduledReview[]> = {};
  for (const r of reviews) {
    if (!map[r.scheduled_date]) map[r.scheduled_date] = [];
    map[r.scheduled_date].push(r);
  }
  return map;
}

/** Returns the residency group color for a given taxonomy area */
export const RESIDENCY_COLORS: Record<string, string> = {
  'Clínica Médica': '#3B82F6',       // blue-500
  'Cirurgia': '#F97316',             // orange-500
  'Ginecologia e Obstetrícia': '#EC4899', // pink-500
  'Pediatria': '#10B981',            // emerald-500
  'Medicina Preventiva': '#8B5CF6',  // violet-500
};

export function getResidencyColor(area: string): string {
  const group = RESIDENCY_GROUPS[area] ?? 'Clínica Médica';
  return RESIDENCY_COLORS[group] ?? '#6B7280';
}

/** Mark pending reviews as missed if their scheduled_date < today */
export function filterMissed(reviews: ScheduledReview[], todayStr: string): {
  missed: ScheduledReview[];
  upcoming: ScheduledReview[];
} {
  const missed = reviews.filter(
    (r) => r.status === 'pending' && r.scheduled_date < todayStr,
  );
  const upcoming = reviews.filter(
    (r) => r.status === 'pending' && r.scheduled_date >= todayStr,
  );
  return { missed, upcoming };
}
