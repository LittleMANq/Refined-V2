import type { Gender } from './gender';

// Hebrew dictionary (default locale). Hebrew-first, RTL.
// This is the source-of-truth shape for all translations.
// Every user-facing string lives here; never hardcode strings in components.
//
// Gender-aware: the dictionary is a function of the captured gender, so screens
// receive already-resolved gendered-singular strings (CLAUDE.md §3: address ONE
// person in the correct gender, never plural/formal). `g(woman, default)` picks
// the feminine form for women and the unmarked form (masculine / unspecified)
// otherwise. Tone: simple, warm, explains the why, no em dash.
export function he(gender: Gender) {
  const fem = gender === 'woman';
  const g = (woman: string, other: string) => (fem ? woman : other);

  return {
    app: {
      name: 'Refined',
    },
    common: {
      continue: g('המשיכי', 'המשך'),
      skip: g('דלגי', 'דלג'),
      maybeLater: 'אולי אחר כך',
      notNow: 'לא עכשיו',
      retry: g('נסי שוב', 'נסה שוב'),
      switchLanguage: 'English',
      selected: 'נבחרו',
      pieces: 'פריטים',
      look: 'לוק',
    },
    today: {
      greeting: 'בוקר טוב',
      identityEyebrow: 'זהות הסטייל שלך',
      todayLookEyebrow: 'הלוק של היום',
      whyThis: 'למה זה?',
      paletteLabel: 'הפלטה שלך',
      closetCard: 'הארון שלי',
      noLookTitle: 'הלוק הראשון שלך מחכה',
      noLookBody: 'הוסיפי עוד כמה פריטים והסטייליסט יתחיל להרכיב.',
      openGallery: 'מערכת העיצוב',
      loading: 'רגע אחד',
    },
    onboarding: {
      intro: {
        skip: g('דלגי', 'דלג'),
        next: g('המשיכי', 'המשך'),
        start: g('בואי נתחיל', 'בוא נתחיל'),
        slides: [
          {
            eyebrow: 'סטייליסט אישי',
            title: 'סטייל\nשמבין אותך',
            body: 'כמה תמונות, ותוך דקה זהות סטייל ולוקים אמיתיים, בדיוק שלך.',
          },
          {
            eyebrow: 'ניתוח',
            title: 'ניתוח אישי\nשמתחיל ממך',
            body: 'גוף, פרופורציות וגוון עור. מבינים אותך לפני הבגדים.',
          },
          {
            eyebrow: 'לוקים',
            title: 'לוקים שבנויים\nבדיוק עליך',
            body: 'כל לוק מגיע עם הסבר קצר למה הוא עובד עבורך.',
          },
          {
            eyebrow: 'הארון',
            title: 'סטייליסט שמכיר\nאת הארון שלך',
            body: 'מצלמים פעם אחת, והבגדים שלך הופכים ללוקים.',
          },
        ],
      },
      context: {
        eyebrow: 'נעים להכיר',
        title: 'מי מתלבש?',
        subtitle: 'נתאים את הניתוח, הלוקים והשפה בדיוק אליך.',
        genderWoman: 'אישה',
        genderMan: 'גבר',
        genderUnspecified: 'ללא הגדרה',
        contextQuestion: g('לאילו רגעים את מתלבשת בעיקר?', 'לאילו רגעים אתה מתלבש בעיקר?'),
        contextWork: 'עבודה ומשרד',
        contextCasual: "יומיום וקז'ואל",
        contextEvening: 'ערב ואירועים',
        contextSmart: "סמארט קז'ואל",
      },
      archetype: {
        eyebrow: 'ההשראה שלך',
        title: 'מה מושך אותך?',
        subtitle: g(
          'בחרי את העולמות שמדברים אליך. אפשר יותר מאחד.',
          'בחר את העולמות שמדברים אליך. אפשר יותר מאחד.',
        ),
        chooseAtLeastOne: g('בחרי לפחות אחד', 'בחר לפחות אחד'),
        quiet: { label: 'יוקרה שקטה', sub: 'מינימליזם עשיר' },
        street: { label: 'סטריט', sub: 'עירוני ונועז' },
        minimal: { label: 'מינימל', sub: 'נקי ומדויק' },
        high: { label: 'היי פאשן', sub: 'אוונגרד מודגש' },
        sport: { label: 'ספורט שיק', sub: "אתלוז'ר מוקפד" },
        classic: { label: 'קלאסי', sub: 'נצחי ושקול' },
      },
      capture: {
        eyebrow: 'צילום',
        title: 'תמונת גוף מלא',
        subtitle: g(
          'עמדי ישר, ידיים חופשיות. ככל שהתמונה ברורה יותר, הניתוח מדויק יותר.',
          'עמוד ישר, ידיים חופשיות. ככל שהתמונה ברורה יותר, הניתוח מדויק יותר.',
        ),
        modeFullBody: 'מצב גוף מלא',
        frameHint: g('עמדי במרכז המסגרת', 'עמוד במרכז המסגרת'),
        tipFullBody: 'גוף מלא בפריים',
        tipLight: 'תאורה טבעית',
        tipBackground: 'רקע נקי',
        takePhoto: g('צלמי תמונה', 'צלם תמונה'),
        chooseGallery: g('בחרי מהגלריה', 'בחר מהגלריה'),
        privacy: 'התמונות נשארות פרטיות',
        photo: 'תמונה',
        analyze: g('נתחי את הסטייל שלי', 'נתח את הסטייל שלי'),
        cameraDenied: 'צריך הרשאת מצלמה כדי לצלם. אפשר גם לבחור מהגלריה.',
        galleryDenied: 'צריך הרשאת גלריה כדי לבחור תמונה.',
      },
      analysis: {
        working: 'מנתחים את הפרופורציות, הגוון והסטייל שלך…',
        done: 'הניתוח מוכן',
        phases: [
          'מיישרים את התמונה',
          'מנתחים פרופורציות וגובה',
          'קוראים את גוון העור',
          'מזהים את הפריטים שלבשת',
          'מרכיבים את זהות הסטייל',
        ],
        seeResults: g('ראי מה מצאנו', 'ראה מה מצאנו'),
      },
      error: {
        eyebrow: 'כמעט שם',
        title: 'לא הצלחנו לנתח\nאת התמונה',
        body: 'אולי התמונה קצת חתוכה או חשוכה. תמונת גוף מלא בתאורה טובה תעבוד מצוין.',
        tryAnother: g('נסי תמונה אחרת', 'נסה תמונה אחרת'),
        chooseGallery: g('בחרי מהגלריה', 'בחר מהגלריה'),
      },
      review: {
        eyebrow: 'סקירה',
        found: 'מצאנו',
        items: 'פריטים',
        subtitle: g('החליקי ימינה לשמור, שמאלה להסיר.', 'החלק ימינה לשמור, שמאלה להסיר.'),
        item: 'פריט',
        editDetails: g('ערכי פרטים', 'ערוך פרטים'),
        remove: g('הסירי', 'הסר'),
        keep: g('שמרי', 'שמור'),
        savedPrefix: 'שמרת',
        savedSuffix: 'פריטים',
        doneBody: 'הם מצטרפים לארון שלך וישמשו ללוקים הבאים.',
        addToCloset: g('הוסיפי לארון', 'הוסף לארון'),
        remainingPrefix: 'נותרו',
        remainingSuffix: 'לבדיקה',
      },
      taste: {
        eyebrow: 'טעם אישי',
        title: 'מה קרוב יותר אליך?',
        subtitle: g('שתי גישות, אותה אלגנטיות. בחרי את שלך.', 'שתי גישות, אותה אלגנטיות. בחר את שלך.'),
        softLabel: 'קווים רכים',
        softNote: 'נופל, נוח, זורם',
        sharpLabel: 'קווים נקיים',
        sharpNote: 'מובנה, חד, מדויק',
        fitQuestion: g('איך את אוהבת שהבגד יושב?', 'איך אתה אוהב שהבגד יושב?'),
        fitTailored: 'צמוד לגוף',
        fitRegular: 'רגיל',
        fitRelaxed: 'רפוי',
        cta: g('ראי את זהות הסטייל שלי', 'ראה את זהות הסטייל שלי'),
      },
      reveal: {
        eyebrow: 'זהות הסטייל שלך',
        scrollHint: g('גללי לגלות עוד', 'גלול לגלות עוד'),
        paletteLabel: 'הצבעים שמחמיאים לך',
        looksLabel: 'שלושת הלוקים הראשונים שלך',
        nextItemLabel: 'הפריט הבא ששווה לך',
        feelsRight: 'מרגיש נכון?',
        spotOn: 'בול עליי',
        fineTune: 'כוונון עדין',
        save: g('שמרי את זהות הסטייל שלי', 'שמור את זהות הסטייל שלי'),
        saving: 'שומרים…',
        saveError: 'לא הצלחנו לשמור. ננסה שוב.',
      },
      signup: {
        identityLabel: 'זהות הסטייל שלך',
        paletteLabel: 'הפלטה שלך',
        title: g('שמרי את זהות\nהסטייל שלך', 'שמור את זהות\nהסטייל שלך'),
        subtitle: g(
          'כדי שנשמור את הניתוח, הארון והלוקים שלך, ונחזיר אותך בדיוק לאן שהפסקת.',
          'כדי שנשמור את הניתוח, הארון והלוקים שלך, ונחזיר אותך בדיוק לאן שהפסקת.',
        ),
        apple: g('המשיכי עם אפל', 'המשיך עם אפל'),
        google: g('המשיכי עם גוגל', 'המשיך עם גוגל'),
        or: 'או',
        emailPlaceholder: 'האימייל שלך',
        emailCta: g('המשיכי עם אימייל', 'המשיך עם אימייל'),
        emailSent: 'שלחנו אליך קישור לאימות. אפשר להמשיך בינתיים.',
        emailError: 'האימייל לא נראה תקין. ננסה שוב?',
        maybeLater: 'אולי אחר כך',
      },
      permissions: {
        title: g('קבלי לוק מותאם\nבכל בוקר', 'קבל לוק מותאם\nבכל בוקר'),
        subtitle: 'התראה רגועה אחת ביום, מותאמת למזג האוויר וליומן שלך. בלי רעש מיותר.',
        notifBrand: 'REFINED',
        notifNow: 'עכשיו',
        notifTitle: 'הלוק של היום מוכן',
        notifBody: 'בוקר טוב. מזג אוויר נעים היום, הנה מה שילך לך מצוין.',
        dailyLook: 'לוק יומי',
        dailyLookDetail: 'חום חולי, קליל ל-24°',
        enable: g('אפשרי התראות', 'אפשר התראות'),
        notNow: 'לא עכשיו',
      },
    },
  };
}
