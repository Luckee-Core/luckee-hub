'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { AppLayoutBreadcrumb } from './app-layout-breadcrumb';

type BreadcrumbBarProps = {
  items: AppLayoutBreadcrumb[];
  dismissMenusSignal?: boolean;
};

export const BreadcrumbBar = (props: BreadcrumbBarProps) => {
  const { items, dismissMenusSignal } = props;

  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const breadcrumbRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    setOpenMenuIndex(null);
  }, [dismissMenusSignal]);

  useEffect(() => {
    if (openMenuIndex === null) {
      return undefined;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const currentMenuElement = breadcrumbRefs.current[openMenuIndex];
      if (currentMenuElement && !currentMenuElement.contains(event.target as Node)) {
        setOpenMenuIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuIndex]);

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      {items.map((item, index) => {
        const separator = index > 0;
        const isRoot = index === 0;

        return (
          <li
            key={`${item.label}-${index}-${item.href ?? ''}`}
            className={styles.breadcrumbItem}
            ref={(element) => {
              breadcrumbRefs.current[index] = element;
            }}
          >
            {separator ? (
              <span className={styles.breadcrumbSeparator} aria-hidden="true">
                /
              </span>
            ) : null}
            {item.href ? (
              <Link
                href={item.href}
                className={`${styles.breadcrumbLink} ${isRoot ? styles.breadcrumbRoot : ''}`}
              >
                {item.label}
              </Link>
            ) : (
              <span className={styles.breadcrumbCurrent} aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        );
      })}
    </>
  );
};

const styles = {
  breadcrumbSeparator: `
    shrink-0 px-1 text-sm text-gray-300 select-none
  `,
  breadcrumbItem: `
    relative flex min-w-0 items-center
  `,
  breadcrumbLink: `
    truncate text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 focus:outline-none
  `,
  breadcrumbRoot: `
    text-gray-500 font-normal hover:text-gray-800
  `,
  breadcrumbCurrent: `
    truncate text-sm font-semibold text-gray-900
  `,
};
