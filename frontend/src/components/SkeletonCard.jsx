import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-3d-soft p-0 flex flex-col h-full animate-pulse">
      <div className="aspect-square bg-slate-200" />
      <div className="p-5 flex-1 flex flex-col">
        <div className="h-5 bg-slate-200 rounded-md w-3/4 mb-2.5" />
        <div className="h-3 bg-slate-200 rounded-md w-full mb-1.5" />
        <div className="h-3 bg-slate-200 rounded-md w-5/6 mb-4" />
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
          <div>
            <div className="h-3 bg-slate-200 rounded-md w-10 mb-1" />
            <div className="h-5 bg-slate-200 rounded-md w-24" />
          </div>
          <div className="h-8 bg-slate-200 rounded-lg w-16" />
        </div>
      </div>
    </div>
  );
}
