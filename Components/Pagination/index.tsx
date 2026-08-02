"use client";

import Icon from "@/Components/Icons";
import { cx, pageWindow } from "@/utils/helper";
import styles from "./Pagination.module.scss";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
  const items = pageWindow(page, totalPages, 1);

  return (
    <nav className={styles.pager} aria-label="Pagination">
      <button
        type="button"
        className={styles.btn}
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <Icon name="chevronLeft" size={15} />
      </button>

      {items.map((item, index) =>
        item === "gap" ? (
          <span key={`gap-${index}`} className={styles.gap} aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={cx(styles.btn, item === page && styles.active)}
            onClick={() => onChange(item)}
            aria-current={item === page ? "page" : undefined}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        className={styles.btn}
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        <Icon name="chevronRight" size={15} />
      </button>
    </nav>
  );
}
