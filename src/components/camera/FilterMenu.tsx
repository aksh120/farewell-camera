"use client";

import React, { useState } from "react";
import { VINTAGE_FILTERS, VintageFilter } from "@/lib/filters";
import { SlidersHorizontal, X } from "lucide-react";

interface FilterMenuProps {
  selectedFilter: VintageFilter;
  onSelectFilter: (filter: VintageFilter) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function FilterMenu({
  selectedFilter,
  onSelectFilter,
  isOpen,
  onToggle,
}: FilterMenuProps) {
  return (
    <>
      {}
      <button
        onClick={onToggle}
        className={`
          absolute top-4 right-4 z-20
          w-11 h-11 rounded-full
          flex items-center justify-center
          transition-all duration-200
          ${
            isOpen
              ? "bg-vintage-cream text-vintage-black"
              : "bg-vintage-charcoal/80 text-vintage-cream backdrop-blur-sm"
          }
        `}
        aria-label={isOpen ? "Close filters" : "Open filters"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <SlidersHorizontal className="w-5 h-5" />
        )}
      </button>

      {}
      {isOpen && (
        <div className="absolute bottom-32 left-0 right-0 z-10 px-2 fade-in-up">
          <div className="bg-vintage-black/80 backdrop-blur-md rounded-2xl py-3 mx-2">
            <div className="overflow-x-auto hide-scrollbar">
              <div className="flex gap-3 px-4 min-w-max">
                {VINTAGE_FILTERS.map((filter) => {
                  const isSelected = filter.id === selectedFilter.id;

                  return (
                    <button
                      key={filter.id}
                      onClick={() => onSelectFilter(filter)}
                      className={`
                        flex flex-col items-center gap-1.5
                        px-3 py-2 rounded-xl
                        transition-all duration-200
                        ${
                          isSelected
                            ? "bg-vintage-cream text-vintage-black scale-105"
                            : "bg-vintage-charcoal/60 text-vintage-cream hover:bg-vintage-charcoal"
                        }
                      `}
                      aria-pressed={isSelected}
                    >
                      <span
                        className="text-xl"
                        role="img"
                        aria-label={filter.name}
                      >
                        {filter.icon}
                      </span>
                      <span
                        className={`
                        text-xs font-medium whitespace-nowrap
                        ${isSelected ? "text-vintage-black" : "text-vintage-beige"}
                      `}
                      >
                        {filter.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {}
            <p className="text-center text-vintage-beige/60 text-xs mt-2">
              Current: {selectedFilter.name}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
