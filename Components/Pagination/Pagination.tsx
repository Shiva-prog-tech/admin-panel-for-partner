"use client";

import Icon from "@/Components/Icons/Icon";
import { cx, pageWindow } from "@/utils/helper";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
  const items = pageWindow(page, totalPages, 1);

  return (
    <nav className="pager" aria-label="Pagination">
      <button
        type="button"
        className="pager__btn"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <Icon name="chevronLeft" size={15} />
      </button>

      {items.map((item, index) =>
        item === "gap" ? (
          <span key={`gap-${index}`} className="pager__gap" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={cx("pager__btn", item === page && "pager__btn--active")}
            onClick={() => onChange(item)}
            aria-current={item === page ? "page" : undefined}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        className="pager__btn"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        <Icon name="chevronRight" size={15} />
      </button>
    </nav>
  );
}
