"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface Team {
  name: string
  contest1: number
  contest2: number
  contest3: number
  contest4: number
  total: number
  status: string
}

interface TeamCardProps {
  team: Team
  rank: number
  isRevealed: boolean
  animationDelay: number
  className?: string
}

export function TeamCard({ team, rank, isRevealed, animationDelay, className }: TeamCardProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-4 h-4 text-primary" />
    if (rank === 2) return <Medal className="w-4 h-4 text-secondary" />
    if (rank === 3) return <Award className="w-4 h-4 text-accent" />
    return null
  }

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return "bg-primary text-primary-foreground"
    if (rank === 2) return "bg-secondary text-secondary-foreground"
    if (rank === 3) return "bg-accent text-accent-foreground"
    return "bg-muted text-muted-foreground"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{
        opacity: isRevealed ? 1 : 0,
        y: isRevealed ? 0 : 50,
        scale: isRevealed ? 1 : 0.9,
      }}
      transition={{
        duration: 0.6,
        delay: animationDelay,
        ease: "easeOut",
      }}
      layout
      layoutId={`team-${team.name}`}
    >
      <Card
        className={cn(
          "p-2 bg-card border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Badge className={`text-xs font-bold px-1.5 py-0.5 ${getRankBadgeColor(rank)}`}>#{rank}</Badge>
            {rank <= 3 && getRankIcon(rank)}
            {team.status === "Winners" && (
              <Badge className="bg-primary text-primary-foreground animate-pulse text-xs px-1">🏆</Badge>
            )}
            <h3 className="text-sm font-bold text-foreground truncate">{team.name}</h3>
          </div>
          <div className="grid grid-cols-4 gap-1">
            <div className="text-center px-1.5 py-0.5 bg-muted/50 rounded w-10">
              <div className="text-xs font-semibold text-chart-2">{team.contest1}</div>
            </div>
            <div className="text-center px-1.5 py-0.5 bg-muted/50 rounded w-10">
              <div className="text-xs font-semibold text-chart-2">{team.contest2}</div>
            </div>
            <div className="text-center px-1.5 py-0.5 bg-muted/50 rounded w-10">
              <div className="text-xs font-semibold text-accent">{team.contest3}</div>
            </div>
            <div className="text-center px-1.5 py-0.5 bg-muted/50 rounded w-10">
              <div className="text-xs font-semibold text-secondary">{team.contest4}</div>
            </div>
          </div>
          <div className="text-right min-w-[60px]">
            <div className="text-lg font-bold text-primary">{team.total}</div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
