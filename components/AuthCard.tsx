"use client"
import React from 'react'
import logo from "../public/logo.png"
import { inherits } from 'util';
export default function AuthCard({ children, subtitle, title }:{children:React.ReactNode; title?:string; subtitle?:string}){
  return (
    <div className="auth-card">
      <div className="brand">
        <div className="logo"><img src={logo.src} alt="logo" style={{width: "inherit"}} /></div>
        <div>
          <div className="title">{'Centre médicale diamond'}</div>
          {subtitle && <div className="subtitle">{subtitle}</div>}
        </div>
      </div>
      {children}
    </div>
  )
}
