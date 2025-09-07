"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { TeamCard } from "@/components/team-card"
import { Play, RotateCcw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import contestData from "@/data/contest-data.json"

interface Team {
  name: string
  contest1: number
  contest2: number
  contest3: number
  contest4: number
  total: number
  status: string
  finalPosition?: number
}

export default function ContestLeaderboard() {
  const [revealedTeams, setRevealedTeams] = useState<Team[]>([])
  const [remainingTeams, setRemainingTeams] = useState<Team[]>([])
  const [isRevealing, setIsRevealing] = useState(false)
  const [nextTeam, setNextTeam] = useState<Team | null>(null)
  const [upcomingTeam, setUpcomingTeam] = useState<Team | null>(null)
  const [recentlyAddedTeam, setRecentlyAddedTeam] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const revealingTeamRef = useRef<HTMLDivElement>(null)

  const sortedTeams = [...contestData].sort((a, b) => b.total - a.total)

  useEffect(() => {
    setRemainingTeams([...sortedTeams])
    if (sortedTeams.length > 0) {
      const randomIndex = Math.floor(Math.random() * sortedTeams.length)
      setUpcomingTeam(sortedTeams[randomIndex])
    }
  }, [])

  const revealNextTeam = () => {
    if (remainingTeams.length === 0 || isRevealing) return

    setIsRevealing(true)

    const selectedTeam = upcomingTeam!

    const futureRevealedTeams = [...revealedTeams, selectedTeam].sort((a, b) => b.total - a.total)
    const finalPosition = futureRevealedTeams.findIndex((team) => team.name === selectedTeam.name)

    setNextTeam({ ...selectedTeam, finalPosition })

    setTimeout(() => {
      const newRevealedTeams = [...revealedTeams, selectedTeam].sort((a, b) => b.total - a.total)
      const newRemainingTeams = remainingTeams.filter((team) => team.name !== selectedTeam.name)

      setRevealedTeams(newRevealedTeams)
      setRemainingTeams(newRemainingTeams)
      setNextTeam(null)
      setRecentlyAddedTeam(selectedTeam.name)

      if (newRemainingTeams.length > 0) {
        const randomIndex = Math.floor(Math.random() * newRemainingTeams.length)
        setUpcomingTeam(newRemainingTeams[randomIndex])
      } else {
        setUpcomingTeam(null)
      }

      setIsRevealing(false)

      setTimeout(() => {
        setRecentlyAddedTeam(null)
      }, 2000)

      setTimeout(() => {
        const teamElements = containerRef.current?.querySelectorAll("[data-team-card]")
        if (teamElements && teamElements[finalPosition]) {
          teamElements[finalPosition].scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          })
        }
      }, 600)
    }, 800)
  }

  const resetLeaderboard = () => {
    setRevealedTeams([])
    setRemainingTeams([...sortedTeams])
    setIsRevealing(false)
    setNextTeam(null)
    setRecentlyAddedTeam(null)
    if (sortedTeams.length > 0) {
      const randomIndex = Math.floor(Math.random() * sortedTeams.length)
      setUpcomingTeam(sortedTeams[randomIndex])
    }
  }

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      revealNextTeam()
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)
    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [remainingTeams, revealedTeams, isRevealing])

  return (
    <div className="min-h-screen bg-background p-2">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-3">
          <h1 className="text-xl font-bold text-foreground mb-1 text-balance">🏆 Contest Leaderboard</h1>
          <p className="text-muted-foreground text-xs">Nhấn Enter hoặc nút Play để reveal đội tiếp theo</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-3 mb-3"
        >
          <Button
            onClick={revealNextTeam}
            disabled={remainingTeams.length === 0 || isRevealing}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6"
          >
            <Play className="w-4 h-4 mr-2" />
            {isRevealing ? "Đang reveal..." : "Reveal Team"}
          </Button>

          <Button
            onClick={resetLeaderboard}
            variant="outline"
            size="sm"
            className="border-border hover:bg-muted bg-transparent"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-3 p-2 bg-card rounded-lg border"
        >
          {upcomingTeam ? (
            <>
              <div className="text-base font-bold text-secondary">{upcomingTeam.name}</div>
            </>
          ) : (
            <>
              <div className="text-base font-bold text-muted-foreground">Hoàn thành</div>
              <div className="text-xs text-muted-foreground">Không còn team nào</div>
            </>
          )}
        </motion.div>

        <div ref={containerRef} className="space-y-1">
          {revealedTeams.map((team, index) => (
            <motion.div key={team.name} data-team-card layout transition={{ duration: 0.8, ease: "easeOut" }}>
              <TeamCard
                team={team}
                rank={index + 1}
                isRevealed={true}
                animationDelay={0}
                className={
                  recentlyAddedTeam === team.name ? "border-2 border-yellow-400 shadow-lg shadow-yellow-400/20" : ""
                }
              />
            </motion.div>
          ))}

          <AnimatePresence>
            {nextTeam && (
              <motion.div
                ref={revealingTeamRef}
                initial={{ opacity: 0, y: 100, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                }}
                className="relative"
                style={{ zIndex: 10 }}
              >
                <TeamCard
                  team={nextTeam}
                  rank={revealedTeams.filter((t) => t.total > nextTeam.total).length + 1}
                  isRevealed={true}
                  animationDelay={0}
                  className="border-2 border-yellow-400 shadow-lg shadow-yellow-400/20 bg-card"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {revealedTeams.length === 0 && !nextTeam && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
            <div className="text-3xl mb-2">🎮</div>
            <h3 className="text-base font-semibold text-foreground mb-1">Sẵn sàng bắt đầu!</h3>
            <p className="text-muted-foreground text-xs">Nhấn Enter hoặc nút Play để reveal đội đầu tiên</p>
          </motion.div>
        )}

        {remainingTeams.length === 0 && revealedTeams.length > 0 && !nextTeam && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-3 mt-3 bg-primary/10 rounded-lg border border-primary/20"
          >
            <div className="text-2xl mb-2">🎉</div>
            <h3 className="text-lg font-bold text-primary mb-1">Hoàn thành!</h3>
            <p className="text-muted-foreground text-xs">Tất cả các đội đã được reveal. Nhấn Reset để bắt đầu lại.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
