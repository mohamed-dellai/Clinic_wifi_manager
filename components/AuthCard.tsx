"use client"
import React from 'react'
import logo from "@/public/logo.png"
import { TypographyH1, TypographySmall } from "@/components/ui/typography"

export default function AuthCard({ children, subtitle, title }:{children:React.ReactNode; title?:string; subtitle?:string}){
  return (
    <div className="card-base p-8 w-full max-w-md">
      <div className="flex gap-4 mb-8 items-start">
        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center flex-shrink-0">
          <img src={logo.src} alt="logo" className="w-10 h-10" />
        </div>
        <div className="flex-1">
          <TypographyH1 className="text-xl font-bold text-primary mb-1">
            Centre Médicale Diamond
          </TypographyH1>
          {subtitle && <TypographySmall className="text-muted-fg">{subtitle}</TypographySmall>}
        </div>
      </div>
      {children}
    </div>
  )
}
