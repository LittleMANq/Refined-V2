import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';

import { useTranslation, type Gender } from '@/i18n';

import { analyzePhotos, type AnalysisResult, type ExtractedItem } from '../analysis';
import { ensureSession } from './auth';
import { persistOnboarding, type CapturedPhoto, type PersistResult } from './persist';

export type AnalysisStatus = 'idle' | 'working' | 'done' | 'error';
export type Taste = 'soft' | 'sharp';
export type Fit = 'tailored' | 'regular' | 'relaxed';

type OnboardingContextValue = {
  // captured inputs
  gender: Gender;
  contexts: string[];
  archetypes: string[];
  photos: CapturedPhoto[];
  taste: Taste | null;
  fit: Fit | null;
  // analysis
  analysis: AnalysisResult | null;
  analysisStatus: AnalysisStatus;
  analysisError: string | null;
  keptItems: ExtractedItem[];
  // setters
  setGender: (gender: Gender) => void;
  toggleContext: (id: string) => void;
  toggleArchetype: (id: string) => void;
  setPhotos: (photos: CapturedPhoto[]) => void;
  setTaste: (taste: Taste) => void;
  setFit: (fit: Fit) => void;
  isItemKept: (index: number) => boolean;
  setItemKept: (index: number, kept: boolean) => void;
  // actions
  runAnalysis: () => Promise<void>;
  persist: () => Promise<PersistResult>;
  reset: () => void;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const { setGender: setI18nGender } = useTranslation();

  const [gender, setGenderState] = useState<Gender>('unspecified');
  const [contexts, setContexts] = useState<string[]>([]);
  const [archetypes, setArchetypes] = useState<string[]>([]);
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [taste, setTaste] = useState<Taste | null>(null);
  const [fit, setFit] = useState<Fit | null>(null);

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('idle');
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [removed, setRemoved] = useState<Set<number>>(new Set());
  // Guards against double-running the analysis if the screen re-renders.
  const runningRef = useRef(false);

  const setGender = useCallback(
    (g: Gender) => {
      setGenderState(g);
      setI18nGender(g); // switch all copy to the right gendered-singular form
    },
    [setI18nGender],
  );

  const toggle = (setter: typeof setContexts) => (id: string) =>
    setter((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));

  const runAnalysis = useCallback(async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    setAnalysisStatus('working');
    setAnalysisError(null);
    try {
      // Anonymous-first: establish the session before the magic moment so the same
      // user owns everything from here to sign-up. Best-effort, the analyze function
      // still authorizes with the anon key if this is unavailable.
      await ensureSession().catch(() => undefined);
      const result = await analyzePhotos({
        photos: photos.map((p) => ({ base64: p.base64, mediaType: p.mediaType })),
        context: {
          gender,
          styleContext: contexts.join(', ') || undefined,
          archetypes: archetypes.length ? archetypes : undefined,
        },
      });
      setAnalysis(result);
      setRemoved(new Set());
      setAnalysisStatus('done');
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : String(err));
      setAnalysisStatus('error');
    } finally {
      runningRef.current = false;
    }
  }, [photos, gender, contexts, archetypes]);

  const keptItems = useMemo(
    () => (analysis ? analysis.extracted_items.filter((_, i) => !removed.has(i)) : []),
    [analysis, removed],
  );

  const isItemKept = useCallback((index: number) => !removed.has(index), [removed]);

  const setItemKept = useCallback((index: number, kept: boolean) => {
    setRemoved((prev) => {
      const next = new Set(prev);
      if (kept) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const persist = useCallback(() => {
    if (!analysis) throw new Error('Cannot persist before analysis');
    return persistOnboarding({
      gender,
      contexts,
      archetypes,
      taste,
      fit,
      photos,
      analysis,
      keptItems,
    });
  }, [analysis, gender, contexts, archetypes, taste, fit, photos, keptItems]);

  const reset = useCallback(() => {
    setGenderState('unspecified');
    setContexts([]);
    setArchetypes([]);
    setPhotos([]);
    setTaste(null);
    setFit(null);
    setAnalysis(null);
    setAnalysisStatus('idle');
    setAnalysisError(null);
    setRemoved(new Set());
  }, []);

  const value = useMemo<OnboardingContextValue>(
    () => ({
      gender,
      contexts,
      archetypes,
      photos,
      taste,
      fit,
      analysis,
      analysisStatus,
      analysisError,
      keptItems,
      setGender,
      toggleContext: toggle(setContexts),
      toggleArchetype: toggle(setArchetypes),
      setPhotos,
      setTaste,
      setFit,
      isItemKept,
      setItemKept,
      runAnalysis,
      persist,
      reset,
    }),
    [
      gender,
      contexts,
      archetypes,
      photos,
      taste,
      fit,
      analysis,
      analysisStatus,
      analysisError,
      keptItems,
      setGender,
      isItemKept,
      setItemKept,
      runAnalysis,
      persist,
      reset,
    ],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within an OnboardingProvider');
  return ctx;
}
