import { describe, it, test } from "node:test";
import { Layout, loadKeyboard } from "@keybr/keyboard";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { makeKeyStatsMap } from "@keybr/result";
import { Settings } from "@keybr/settings";
import { deepEqual, equal } from "rich-assert";
import { fakeKeyStatsMap, printLessonKeys } from "./fakes.ts";
import { GuidedLesson } from "./guided.ts";
import { LessonKey } from "./key.ts";
import { lessonProps } from "./settings.ts";

test("provide key set", () => {
  const settings = new Settings();
  const keyboard = loadKeyboard(Layout.EN_US);
  const model = new FakePhoneticModel(["uno", "due", "tre"]);
  const lesson = new GuidedLesson(settings, keyboard, model, []);
  const lessonKeys = lesson.update(makeKeyStatsMap(lesson.letters, []));

  deepEqual(lessonKeys.findIncludedKeys(), [
    new LessonKey({
      letter: FakePhoneticModel.letter1,
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isFocused: true,
      isForced: false,
    }),
    new LessonKey({
      letter: FakePhoneticModel.letter2,
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isFocused: false,
      isForced: false,
    }),
    new LessonKey({
      letter: FakePhoneticModel.letter3,
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isFocused: false,
      isForced: false,
    }),
    new LessonKey({
      letter: FakePhoneticModel.letter4,
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isFocused: false,
      isForced: false,
    }),
    new LessonKey({
      letter: FakePhoneticModel.letter5,
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isFocused: false,
      isForced: false,
    }),
    new LessonKey({
      letter: FakePhoneticModel.letter6,
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isFocused: false,
      isForced: false,
    }),
  ]);
  deepEqual(lessonKeys.findExcludedKeys(), [
    new LessonKey({
      letter: FakePhoneticModel.letter7,
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: false,
      isFocused: false,
      isForced: false,
    }),
    new LessonKey({
      letter: FakePhoneticModel.letter8,
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: false,
      isFocused: false,
      isForced: false,
    }),
    new LessonKey({
      letter: FakePhoneticModel.letter9,
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: false,
      isFocused: false,
      isForced: false,
    }),
    new LessonKey({
      letter: FakePhoneticModel.letter10,
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: false,
      isFocused: false,
      isForced: false,
    }),
  ]);
  deepEqual(
    lessonKeys.findFocusedKey(),
    new LessonKey({
      letter: FakePhoneticModel.letter1,
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isFocused: true,
      isForced: false,
    }),
  );
});

describe("generate text from a broken phonetic model", () => {
  const settings = new Settings();
  const keyboard = loadKeyboard(Layout.EN_US);

  it("should generate from empty words", () => {
    const model = new FakePhoneticModel([""]);
    const lesson = new GuidedLesson(settings, keyboard, model, []);
    const lessonKeys = lesson.update(makeKeyStatsMap(lesson.letters, []));

    equal(
      lesson.generate(lessonKeys, model.rng),
      "? ? ? ? ? ? ? ? ? ? " +
        "? ? ? ? ? ? ? ? ? ? " +
        "? ? ? ? ? ? ? ? ? ? " +
        "? ? ? ? ? ? ? ? ? ? " +
        "? ? ? ? ? ? ? ? ? ? " +
        "? ? ? ? ? ? ? ? ? ? " +
        "? ? ? ? ? ? ? ? ? ? " +
        "? ? ? ? ? ? ? ? ? ? " +
        "? ? ? ? ? ? ? ? ? ? " +
        "? ? ? ? ? ? ? ? ? ?",
    );
  });

  it("should generate from repeating words", () => {
    const model = new FakePhoneticModel(["x"]);
    const lesson = new GuidedLesson(settings, keyboard, model, []);
    const lessonKeys = lesson.update(makeKeyStatsMap(lesson.letters, []));

    equal(
      lesson.generate(lessonKeys, model.rng),
      "x x x x x x x x x x " +
        "x x x x x x x x x x " +
        "x x x x x x x x x x " +
        "x x x x x x x x x x " +
        "x x x x x x x x x x " +
        "x x x x x x x x x x " +
        "x x x x x x x x x x " +
        "x x x x x x x x x x " +
        "x x x x x x x x x x " +
        "x x x x x x x x x x",
    );
  });
});

test("generate text with pseudo words", () => {
  const settings = new Settings().set(lessonProps.guided.naturalWords, false);
  const keyboard = loadKeyboard(Layout.EN_US);
  const model = new FakePhoneticModel(["uno", "due", "tre"]);
  const lesson = new GuidedLesson(settings, keyboard, model, []);
  const lessonKeys = lesson.update(makeKeyStatsMap(lesson.letters, []));

  equal(
    lesson.generate(lessonKeys, model.rng),
    "uno due tre " +
      "uno due tre " +
      "uno due tre " +
      "uno due tre " +
      "uno due tre " +
      "uno due tre " +
      "uno due tre " +
      "uno due tre " +
      "uno due tre " +
      "uno due tre " +
      "uno due tre " +
      "uno",
  );
});

test("generate text with natural words", () => {
  const settings = new Settings().set(lessonProps.guided.naturalWords, true);
  const keyboard = loadKeyboard(Layout.EN_US);
  const model = new FakePhoneticModel(["uno", "due", "tre"]);
  const lesson = new GuidedLesson(settings, keyboard, model, [
    "abcaa",
    "abcab",
    "abcac",
    "abcad",
    "abcae",
    "abcaf",
    "abcag",
    "abcah",
    "abcai",
    "abcaj",
    "abcba",
    "abcbb",
    "abcbc",
    "abcbd",
    "abcbe",
  ]);
  const lessonKeys = lesson.update(makeKeyStatsMap(lesson.letters, []));

  equal(
    lesson.generate(lessonKeys, model.rng),
    "abcaf abcbe abcaa abcaf abcbe abcaa abcaf abcbe abcaa abcaf abcbe abcaa " +
      "abcaf abcbe abcaa abcaf abcbe abcaa abcaf abcbe",
  );
});

describe("unlock keys", () => {
  const letter1 = FakePhoneticModel.letter1;
  const letter2 = FakePhoneticModel.letter2;
  const letter3 = FakePhoneticModel.letter3;
  const letter4 = FakePhoneticModel.letter4;
  const letter5 = FakePhoneticModel.letter5;
  const letter6 = FakePhoneticModel.letter6;
  const letter7 = FakePhoneticModel.letter7;
  const letter8 = FakePhoneticModel.letter8;
  const letter9 = FakePhoneticModel.letter9;
  const letter10 = FakePhoneticModel.letter10;

  const keyboard = loadKeyboard(Layout.EN_US);
  const model = new FakePhoneticModel();

  function recoverOff(settings = new Settings()) {
    settings = settings.set(lessonProps.guided.recoverKeys, false);

    const lesson = new GuidedLesson(settings, keyboard, model, []);
    return { settings, lesson };
  }

  function recoverOn(settings = new Settings()) {
    settings = settings.set(lessonProps.guided.recoverKeys, true);
    const lesson = new GuidedLesson(settings, keyboard, model, []);
    return { settings, lesson };
  }

  describe("initial state", () => {
    it("recover off", () => {
      const { settings, lesson } = recoverOff();

      equal(
        printLessonKeys(
          lesson.update(
            fakeKeyStatsMap(settings, [
              [letter1, null, null], // A
              [letter2, null, null], // B
              [letter3, null, null], // C
              [letter4, null, null], // D
              [letter5, null, null], // E
              [letter6, null, null], // F
              [letter7, null, null], // G
              [letter8, null, null], // H
              [letter9, null, null], // I
              [letter10, null, null], // J
            ]),
          ),
        ),
        "[A]BCDEF",
      );
    });

    it("recover on", () => {
      const { settings, lesson } = recoverOn();

      equal(
        printLessonKeys(
          lesson.update(
            fakeKeyStatsMap(settings, [
              [letter1, null, null], // A
              [letter2, null, null], // B
              [letter3, null, null], // C
              [letter4, null, null], // D
              [letter5, null, null], // E
              [letter6, null, null], // F
              [letter7, null, null], // G
              [letter8, null, null], // H
              [letter9, null, null], // I
              [letter10, null, null], // J
            ]),
          ),
        ),
        "[A]BCDEF",
      );
    });
  });

  describe("the unlocked key has no confidence level", () => {
    describe("all previous keys are now above the target speed", () => {
      it("recover off", () => {
        const { settings, lesson } = recoverOff();

        equal(
          printLessonKeys(
            lesson.update(
              fakeKeyStatsMap(settings, [
                [letter1, 1, 1], // A
                [letter2, 1, 1], // B
                [letter3, 1, 1], // C
                [letter4, 1, 1], // D
                [letter5, 1, 1], // E
                [letter6, 1, 1], // F
                [letter7, null, null], // G
                [letter8, null, null], // H
                [letter9, null, null], // I
                [letter10, 1, 1], // J
              ]),
            ),
          ),
          "ABCDEF[G]J",
        );
      });

      it("recover on", () => {
        const { settings, lesson } = recoverOn();

        equal(
          printLessonKeys(
            lesson.update(
              fakeKeyStatsMap(settings, [
                [letter1, 1, 1], // A
                [letter2, 1, 1], // B
                [letter3, 1, 1], // C
                [letter4, 1, 1], // D
                [letter5, 1, 1], // E
                [letter6, 1, 1], // F
                [letter7, null, null], // G
                [letter8, null, null], // H
                [letter9, null, null], // I
                [letter10, 1, 1], // J
              ]),
            ),
          ),
          "ABCDEF[G]J",
        );
      });
    });

    describe("all previous keys were once above the target speed", () => {
      it("recover off", () => {
        const { settings, lesson } = recoverOff();

        equal(
          printLessonKeys(
            lesson.update(
              fakeKeyStatsMap(settings, [
                [letter1, 0.9, 1], // A
                [letter2, 0.9, 1], // B
                [letter3, 0.9, 1], // C
                [letter4, 0.9, 1], // D
                [letter5, 0.9, 1], // E
                [letter6, 0.9, 1], // F
                [letter7, null, null], // G
                [letter8, null, null], // H
                [letter9, null, null], // I
                [letter10, 1, 1], // J
              ]),
            ),
          ),
          "ABCDEF[G]J",
        );
      });

      it("recover on", () => {
        const { settings, lesson } = recoverOn();

        equal(
          printLessonKeys(
            lesson.update(
              fakeKeyStatsMap(settings, [
                [letter1, 0.9, 1], // A
                [letter2, 0.9, 1], // B
                [letter3, 0.9, 1], // C
                [letter4, 0.9, 1], // D
                [letter5, 0.9, 1], // E
                [letter6, 0.9, 1], // F
                [letter7, null, null], // G
                [letter8, null, null], // H
                [letter9, null, null], // I
                [letter10, 1, 1], // J
              ]),
            ),
          ),
          "[A]BCDEFJ",
        );
      });
    });
  });

  describe("the unlocked key has a low confidence level", () => {
    describe("all previous keys are now above the target speed", () => {
      it("recover off", () => {
        const { settings, lesson } = recoverOff();

        equal(
          printLessonKeys(
            lesson.update(
              fakeKeyStatsMap(settings, [
                [letter1, 1, 1], // A
                [letter2, 1, 1], // B
                [letter3, 1, 1], // C
                [letter4, 1, 1], // D
                [letter5, 1, 1], // E
                [letter6, 1, 1], // F
                [letter7, 0.5, 0.5], // G
                [letter8, 0.5, 0.5], // H
                [letter9, null, null], // I
                [letter10, 1, 1], // J
              ]),
            ),
          ),
          "ABCDEF[G]J",
        );
      });

      it("recover on", () => {
        const { settings, lesson } = recoverOn();

        equal(
          printLessonKeys(
            lesson.update(
              fakeKeyStatsMap(settings, [
                [letter1, 1, 1], // A
                [letter2, 1, 1], // B
                [letter3, 1, 1], // C
                [letter4, 1, 1], // D
                [letter5, 1, 1], // E
                [letter6, 1, 1], // F
                [letter7, 0.5, 0.5], // G
                [letter8, 0.5, 0.5], // H
                [letter9, null, null], // I
                [letter10, 1, 1], // J
              ]),
            ),
          ),
          "ABCDEF[G]J",
        );
      });
    });

    describe("all previous keys were once above the target speed", () => {
      it("recover off", () => {
        const { settings, lesson } = recoverOff();

        equal(
          printLessonKeys(
            lesson.update(
              fakeKeyStatsMap(settings, [
                [letter1, 0.9, 1], // A
                [letter2, 0.9, 1], // B
                [letter3, 0.9, 1], // C
                [letter4, 0.9, 1], // D
                [letter5, 0.9, 1], // E
                [letter6, 0.9, 1], // F
                [letter7, 0.5, 0.5], // G
                [letter8, 0.5, 0.5], // H
                [letter9, null, null], // I
                [letter10, 1, 1], // J
              ]),
            ),
          ),
          "ABCDEF[G]J",
        );
      });

      it("recover on", () => {
        const { settings, lesson } = recoverOn();

        equal(
          printLessonKeys(
            lesson.update(
              fakeKeyStatsMap(settings, [
                [letter1, 0.9, 1], // A
                [letter2, 0.9, 1], // B
                [letter3, 0.9, 1], // C
                [letter4, 0.9, 1], // D
                [letter5, 0.9, 1], // E
                [letter6, 0.9, 1], // F
                [letter7, 0.5, 0.5], // G
                [letter8, 0.5, 0.5], // H
                [letter9, null, null], // I
                [letter10, 1, 1], // J
              ]),
            ),
          ),
          "[A]BCDEFJ",
        );
      });
    });
  });

  describe("all keys are unlocked", () => {
    describe("some keys are below the target speed", () => {
      it("recover off", () => {
        const { settings, lesson } = recoverOff();

        equal(
          printLessonKeys(
            lesson.update(
              fakeKeyStatsMap(settings, [
                [letter1, 1, 1], // A
                [letter2, 1, 1], // B
                [letter3, 1, 1], // C
                [letter4, 1, 1], // D
                [letter5, 1, 1], // E
                [letter6, 1, 1], // F
                [letter7, 1, 1], // G
                [letter8, 1, 1], // H
                [letter9, 1, 1], // I
                [letter10, 0.9, 1], // J
              ]),
            ),
          ),
          "ABCDEFGHIJ",
        );
      });

      it("recover on", () => {
        const { settings, lesson } = recoverOn();

        equal(
          printLessonKeys(
            lesson.update(
              fakeKeyStatsMap(settings, [
                [letter1, 1, 1], // A
                [letter2, 1, 1], // B
                [letter3, 1, 1], // C
                [letter4, 1, 1], // D
                [letter5, 1, 1], // E
                [letter6, 1, 1], // F
                [letter7, 1, 1], // G
                [letter8, 1, 1], // H
                [letter9, 1, 1], // I
                [letter10, 0.9, 1], // J
              ]),
            ),
          ),
          "ABCDEFGHI[J]",
        );
      });
    });

    describe("all keys are above the target speed", () => {
      it("recover off", () => {
        const { settings, lesson } = recoverOff();

        equal(
          printLessonKeys(
            lesson.update(
              fakeKeyStatsMap(settings, [
                [letter1, 1, 1], // A
                [letter2, 1, 1], // B
                [letter3, 1, 1], // C
                [letter4, 1, 1], // D
                [letter5, 1, 1], // E
                [letter6, 1, 1], // F
                [letter7, 1, 1], // G
                [letter8, 1, 1], // H
                [letter9, 1, 1], // I
                [letter10, 1, 1], // J
              ]),
            ),
          ),
          "ABCDEFGHIJ",
        );
      });

      it("recover on", () => {
        const { settings, lesson } = recoverOn();

        equal(
          printLessonKeys(
            lesson.update(
              fakeKeyStatsMap(settings, [
                [letter1, 1, 1], // A
                [letter2, 1, 1], // B
                [letter3, 1, 1], // C
                [letter4, 1, 1], // D
                [letter5, 1, 1], // E
                [letter6, 1, 1], // F
                [letter7, 1, 1], // G
                [letter8, 1, 1], // H
                [letter9, 1, 1], // I
                [letter10, 1, 1], // J
              ]),
            ),
          ),
          "ABCDEFGHIJ",
        );
      });
    });
  });

  describe("manually unlock keys", () => {
    describe("initial state", () => {
      it("recover off", () => {
        const { settings, lesson } = recoverOff(
          new Settings().set(lessonProps.guided.alphabetSize, 1),
        );

        equal(
          printLessonKeys(
            lesson.update(
              fakeKeyStatsMap(settings, [
                [letter1, null, null], // A
                [letter2, null, null], // B
                [letter3, null, null], // C
                [letter4, null, null], // D
                [letter5, null, null], // E
                [letter6, null, null], // F
                [letter7, null, null], // G
                [letter8, null, null], // H
                [letter9, null, null], // I
                [letter10, null, null], // J
              ]),
            ),
          ),
          "[A]BCDEF!G!H!I!J",
        );
      });

      it("recover on", () => {
        const { settings, lesson } = recoverOn(
          new Settings().set(lessonProps.guided.alphabetSize, 1),
        );

        equal(
          printLessonKeys(
            lesson.update(
              fakeKeyStatsMap(settings, [
                [letter1, null, null], // A
                [letter2, null, null], // B
                [letter3, null, null], // C
                [letter4, null, null], // D
                [letter5, null, null], // E
                [letter6, null, null], // F
                [letter7, null, null], // G
                [letter8, null, null], // H
                [letter9, null, null], // I
                [letter10, null, null], // J
              ]),
            ),
          ),
          "[A]BCDEF!G!H!I!J",
        );
      });
    });
  });
});

describe("manual lock filtering", () => {
  const letter1 = FakePhoneticModel.letter1;
  const letter2 = FakePhoneticModel.letter2;
  const letter3 = FakePhoneticModel.letter3;
  const letter4 = FakePhoneticModel.letter4;
  const letter5 = FakePhoneticModel.letter5;
  const letter6 = FakePhoneticModel.letter6;
  const letter7 = FakePhoneticModel.letter7;
  const letter8 = FakePhoneticModel.letter8;
  const letter9 = FakePhoneticModel.letter9;
  const letter10 = FakePhoneticModel.letter10;

  const keyboard = loadKeyboard(Layout.EN_US);
  const model = new FakePhoneticModel();

  test("should exclude manually locked keys from lesson", () => {
    const settings = new Settings().set(
      lessonProps.guided.manualLocks,
      `${letter7.codePoint},${letter8.codePoint},${letter9.codePoint}`,
    ); // Lock G, H, I
    const lesson = new GuidedLesson(settings, keyboard, model, []);

    const lessonKeys = lesson.update(
      fakeKeyStatsMap(settings, [
        [letter1, null, null], // A
        [letter2, null, null], // B
        [letter3, null, null], // C
        [letter4, null, null], // D
        [letter5, null, null], // E
        [letter6, null, null], // F
        [letter7, null, null], // G (locked)
        [letter8, null, null], // H (locked)
        [letter9, null, null], // I (locked)
        [letter10, null, null], // J
      ]),
    );

    // Verify G, H, I are excluded (not in lesson)
    const includedKeys = lessonKeys.findIncludedKeys();
    equal(
      includedKeys.some((k) => k.letter.codePoint === letter7.codePoint),
      false,
      "Letter G should be excluded",
    );
    equal(
      includedKeys.some((k) => k.letter.codePoint === letter8.codePoint),
      false,
      "Letter H should be excluded",
    );
    equal(
      includedKeys.some((k) => k.letter.codePoint === letter9.codePoint),
      false,
      "Letter I should be excluded",
    );
  });

  test("should allow unlocking keys", () => {
    // First lock some keys
    let settings = new Settings().set(
      lessonProps.guided.manualLocks,
      `${letter7.codePoint},${letter8.codePoint}`,
    );
    let lesson = new GuidedLesson(settings, keyboard, model, []);

    let lessonKeys = lesson.update(
      fakeKeyStatsMap(settings, [
        [letter1, 1, 1], // A
        [letter2, 1, 1], // B
        [letter3, 1, 1], // C
        [letter4, 1, 1], // D
        [letter5, 1, 1], // E
        [letter6, 1, 1], // F
        [letter7, 1, 1], // G (locked)
        [letter8, 1, 1], // H (locked)
        [letter9, null, null], // I
        [letter10, null, null], // J
      ]),
    );

    // G and H should be excluded (even though they have confidence)
    equal(
      lessonKeys
        .findIncludedKeys()
        .some((k) => k.letter.codePoint === letter7.codePoint),
      false,
      "Letter G should be excluded when locked",
    );

    // Now unlock G
    settings = settings.set(
      lessonProps.guided.manualLocks,
      `${letter8.codePoint}`,
    );
    lesson = new GuidedLesson(settings, keyboard, model, []);

    lessonKeys = lesson.update(
      fakeKeyStatsMap(settings, [
        [letter1, 1, 1], // A
        [letter2, 1, 1], // B
        [letter3, 1, 1], // C
        [letter4, 1, 1], // D
        [letter5, 1, 1], // E
        [letter6, 1, 1], // F
        [letter7, 1, 1], // G (now unlocked)
        [letter8, 1, 1], // H (still locked)
        [letter9, null, null], // I
        [letter10, null, null], // J
      ]),
    );

    // G should now be included (unlocked + has confidence)
    equal(
      lessonKeys
        .findIncludedKeys()
        .some((k) => k.letter.codePoint === letter7.codePoint),
      true,
      "Letter G should be included when unlocked",
    );

    // H should still be excluded (still locked)
    equal(
      lessonKeys
        .findIncludedKeys()
        .some((k) => k.letter.codePoint === letter8.codePoint),
      false,
      "Letter H should still be excluded (still locked)",
    );
  });

  test("should handle edge case: all possible keys locked", () => {
    // Lock all keys beyond the first 6 (MIN_ALPHABET_SIZE)
    const settings = new Settings().set(
      lessonProps.guided.manualLocks,
      `${letter7.codePoint},${letter8.codePoint},${letter9.codePoint},${letter10.codePoint}`,
    );
    const lesson = new GuidedLesson(settings, keyboard, model, []);

    const lessonKeys = lesson.update(
      fakeKeyStatsMap(settings, [
        [letter1, null, null], // A
        [letter2, null, null], // B
        [letter3, null, null], // C
        [letter4, null, null], // D
        [letter5, null, null], // E
        [letter6, null, null], // F
        [letter7, null, null], // G (locked)
        [letter8, null, null], // H (locked)
        [letter9, null, null], // I (locked)
        [letter10, null, null], // J (locked)
      ]),
    );

    // Only first 6 keys should be included
    const includedKeys = lessonKeys.findIncludedKeys();
    equal(includedKeys.length, 6, "Only first 6 keys should be included");
  });

  test("should handle edge case: empty locks", () => {
    const settings = new Settings().set(lessonProps.guided.manualLocks, "");
    const lesson = new GuidedLesson(settings, keyboard, model, []);

    const lessonKeys = lesson.update(
      fakeKeyStatsMap(settings, [
        [letter1, null, null], // A
        [letter2, null, null], // B
        [letter3, null, null], // C
        [letter4, null, null], // D
        [letter5, null, null], // E
        [letter6, null, null], // F
        [letter7, null, null], // G
        [letter8, null, null], // H
        [letter9, null, null], // I
        [letter10, null, null], // J
      ]),
    );

    // All keys should be included (subject to normal lesson logic)
    const includedKeys = lessonKeys.findIncludedKeys();
    equal(includedKeys.length, 6, "First 6 keys should be included by default");
  });
});
