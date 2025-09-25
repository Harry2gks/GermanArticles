export type CardState = { id: string; interval: number; ease: number; streak: number; nextDue: number };

export function nextReview(state: CardState, grade: 0 | 1 | 2): CardState {
  let { interval, ease, streak } = state;
  ease = Math.max(1.3, ease + (grade === 2 ? 0.1 : grade === 1 ? -0.05 : -0.2));
  streak = grade === 0 ? 0 : streak + 1;
  interval = grade === 0 ? 1 : streak <= 1 ? 1 : Math.round(interval * ease);
  const nextDue = Date.now() + interval * 24 * 60 * 60 * 1000;
  return { ...state, interval, ease, streak, nextDue };
}


