'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { AreaTaxonomy } from '@/lib/config/taxonomy';

interface Props {
  areas: (AreaTaxonomy & {
    totalCount: number;
    subtopicoCounts: Record<string, number>;
  })[];
}

const PINK = '#E292BE';
const BLUE = '#0F3683';
const LIGHT_BG = '#E1F5FF';

export default function AreaAccordionList({ areas }: Props) {
  const [openArea, setOpenArea] = useState<string | null>(null);

  function toggle(slug: string) {
    setOpenArea((prev) => (prev === slug ? null : slug));
  }

  return (
    <div className="grid gap-3">
      {areas.map((area) => {
        const isOpen = openArea === area.slug;
        const hasQuestions = area.totalCount > 0;

        return (
          <div
            key={area.slug}
            className="glass-card overflow-hidden transition-all duration-300"
          >
            {/* Area header row */}
            <button
              onClick={() => toggle(area.slug)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-white/30 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Expand indicator */}
                <span
                  className="text-lg font-black transition-transform duration-300 flex-shrink-0"
                  style={{
                    color: BLUE,
                    transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                    display: 'inline-block',
                  }}
                >
                  ›
                </span>
                <div className="min-w-0">
                  <h2
                    className="text-base font-black truncate"
                    style={{ color: BLUE, fontFamily: 'Nunito, sans-serif' }}
                  >
                    {area.name}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {area.subtopicos.length} subtópicos
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                {/* Question count badge */}
                <div className="text-right">
                  <span
                    className="text-xl font-black"
                    style={{ color: PINK }}
                  >
                    {area.totalCount}
                  </span>
                  <p className="text-xs text-slate-400">questões</p>
                </div>

                {/* "Estudar tudo" button — only shown when not empty */}
                {hasQuestions && (
                  <Link
                    href={`/study/area/${area.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="px-3 py-1.5 rounded-xl text-xs font-black transition-all hover:opacity-90 whitespace-nowrap"
                    style={{
                      backgroundColor: BLUE,
                      color: '#fff',
                      fontFamily: 'Nunito, sans-serif',
                    }}
                  >
                    Estudar tudo
                  </Link>
                )}
              </div>
            </button>

            {/* Subtopico list — animated expand */}
            <div
              style={{
                maxHeight: isOpen ? `${area.subtopicos.length * 56 + 16}px` : '0px',
                overflow: 'hidden',
                transition: 'max-height 0.35s ease',
              }}
            >
              <div
                className="border-t mx-4 mb-2"
                style={{ borderColor: `${PINK}20` }}
              />
              <div className="px-4 pb-3 grid gap-1.5">
                {area.subtopicos.map((sub) => {
                  const count = area.subtopicoCounts[sub.name] ?? 0;
                  const available = count > 0;

                  return (
                    <Link
                      key={sub.slug}
                      href={
                        available
                          ? `/study/area/${area.slug}/${sub.slug}`
                          : '#'
                      }
                      className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${
                        available
                          ? 'hover:bg-white/50 hover:-translate-y-0.5 cursor-pointer'
                          : 'opacity-40 cursor-not-allowed'
                      }`}
                      style={{ backgroundColor: available ? `${LIGHT_BG}` : 'transparent' }}
                    >
                      <span
                        className="text-sm font-bold truncate"
                        style={{ color: BLUE, fontFamily: 'Nunito, sans-serif' }}
                      >
                        {sub.name}
                      </span>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <span
                          className="text-sm font-black"
                          style={{ color: available ? PINK : '#aaa' }}
                        >
                          {count}
                        </span>
                        {available && (
                          <span className="text-xs text-slate-400">questões</span>
                        )}
                        {!available && (
                          <span
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: `${PINK}15`, color: PINK }}
                          >
                            em breve
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
