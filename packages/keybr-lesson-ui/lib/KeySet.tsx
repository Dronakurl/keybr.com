import { type LessonKey, type LessonKeys } from "@keybr/lesson";
import { type ClassName } from "@keybr/widget";
import { useRef } from "react";
import { Key } from "./Key.tsx";

export const KeySet = ({
  id,
  className,
  lessonKeys,
  onKeyHoverIn,
  onKeyHoverOut,
  onKeyClick,
  manualLocks,
  formatTitle,
}: {
  id?: string;
  className?: ClassName;
  lessonKeys: LessonKeys;
  onKeyHoverIn?: (key: LessonKey, elem: Element) => void;
  onKeyHoverOut?: (key: LessonKey, elem: Element) => void;
  onKeyClick?: (key: LessonKey, elem: Element) => void;
  manualLocks?: Set<number>;
  formatTitle?: (lessonKey: LessonKey, isManuallyLocked: boolean) => string;
}) => {
  const ref = useRef<HTMLElement>(null);
  return (
    <span
      ref={ref}
      id={id}
      className={className}
      onMouseOver={(event) => {
        relayEvent(ref.current!, event, onKeyHoverIn);
      }}
      onMouseOut={(event) => {
        relayEvent(ref.current!, event, onKeyHoverOut);
      }}
      onClick={(event) => {
        relayEvent(ref.current!, event, onKeyClick);
      }}
    >
      {[...lessonKeys].map((lessonKey) => {
        const isManuallyLocked =
          manualLocks?.has(lessonKey.letter.codePoint) ?? false;
        return (
          <Key
            key={lessonKey.letter.codePoint}
            lessonKey={lessonKey}
            isManuallyLocked={isManuallyLocked}
            title={
              formatTitle ? formatTitle(lessonKey, isManuallyLocked) : undefined
            }
          />
        );
      })}
    </span>
  );
};

function relayEvent(
  root: Element,
  { target }: { target: any },
  handler?: (key: LessonKey, elem: Element) => void,
) {
  while (
    handler != null &&
    target instanceof Element &&
    root.contains(target)
  ) {
    const key = Key.attached(target);
    if (key) {
      handler(key, target);
      return;
    }
    target = target.parentElement;
  }
}
