'use client';
import { usePathname } from 'next/navigation';
import { PAGES, normPath } from '@/components/Nav';

export default function PageIndicator() {
  const pathname = usePathname();
  const i = Math.max(0, PAGES.findIndex((p) => normPath(p.href) === normPath(pathname)));
  return (
    <div className="indicator" aria-hidden="true">
      <span>0{i + 1} / {PAGES[i].label}</span>
    </div>
  );
}
