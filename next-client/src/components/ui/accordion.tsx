import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import s from './accordion.module.scss'
import classNames from 'classnames'

export interface AccordionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  defaultOpen = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [height, setHeight] = useState<number | undefined>(defaultOpen ? undefined : 0)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        setHeight(contentRef.current.scrollHeight)
      } else {
        setHeight(0)
      }
    }
  }, [isOpen])

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={classNames(s.container, className)}>
      <button className={s.header} onClick={toggleOpen} aria-expanded={isOpen}>
        <span className={s.chevron}>
          {isOpen ? (
            <ChevronDown size={18} color={"var(--color-black)"} />
          ) : (
            <ChevronRight size={18} color={"var(--color-black)"} />
          )}
        </span>
        <span style={{whiteSpace: "wrap"}} className={classNames(s.title, "truncate-text")}>{title}</span>
      </button>

      <div className={classNames(s.content, isOpen && s.open)} style={{ height }} ref={contentRef}>
        <div className={s.content_inner}>{children}</div>
      </div>
    </div>
  )
}

export default Accordion
