import { likertOptions } from '@/data/likert-options'
import { type AnswerValue, type Question } from '@/types'
import { OptionButton } from './option-button'

interface QuestionCardProps {
  question: Question
  questionNumber: number
  total: number
  currentValue: AnswerValue | null
  onAnswer: (value: AnswerValue) => void
}

export function QuestionCard({
  question,
  questionNumber,
  total,
  currentValue,
  onAnswer,
}: QuestionCardProps) {
  return (
    <div>
      <p className="text-sm font-bold text-brand-600 dark:text-brand-300">
        Q{questionNumber}
        <span className="opacity-50"> / {total}</span>
      </p>
      <h2 className="mt-3 min-h-[3.5rem] text-xl font-bold leading-snug sm:text-2xl">
        {question.text}
      </h2>

      <div className="mt-6 flex flex-col gap-2.5">
        {likertOptions.map((option, i) => (
          <OptionButton
            key={option.value}
            label={option.label}
            hotkey={i + 1}
            selected={currentValue === option.value}
            onSelect={() => onAnswer(option.value)}
          />
        ))}
      </div>
    </div>
  )
}
