"use client";

import Icon from "@/Components/Icons";
import useCopyToClipboard from "@/customHooks/useCopyToClipboard";
import { useAppDispatch } from "@/redux/hooks";
import { pushToast } from "@/redux/reducers/ToastReducer";
import { cx, truncateMiddle } from "@/utils/helper";
import styles from "./RefCell.module.scss";

interface RefCellProps {
  value: string;
  /** shorten long hashes in the middle */
  truncate?: false | { head: number; tail: number };
  onOpen?: () => void;
}

/** Amber reference id + inline copy affordance. */
export default function RefCell({ value, truncate = false, onOpen }: RefCellProps) {
  const dispatch = useAppDispatch();
  const { copy, copied } = useCopyToClipboard();

  const label = truncate ? truncateMiddle(value, truncate.head, truncate.tail) : value;
  const isCopied = copied === value;

  return (
    <span className="dt__ref">
      <button type="button" className="dt__ref-id" onClick={onOpen} title={value}>
        {label}
      </button>
      <button
        type="button"
        className={cx(styles.copy, isCopied && styles.done)}
        aria-label={`Copy ${value}`}
        onClick={async () => {
          const ok = await copy(value);
          dispatch(
            pushToast({
              tone: ok ? "success" : "error",
              title: ok ? "Reference copied" : "Could not copy",
              text: ok ? value : "Clipboard access was blocked by the browser.",
            })
          );
        }}
      >
        <Icon name={isCopied ? "check" : "copy"} size={13} />
      </button>
    </span>
  );
}
