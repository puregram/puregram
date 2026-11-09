import { raw } from '@puregram/widgets'

export const baseStyle = raw(`
:root{--track:rgba(127,127,127,.16);--up:#1f9d55;--up-bg:rgba(52,199,89,.14);--down:var(--tg-theme-destructive-text-color,#e5484d);--down-bg:rgba(255,59,48,.12);--accent:var(--tg-theme-button-color);--on-accent:var(--tg-theme-button-text-color);--hint:var(--tg-theme-hint-color)}
@media (prefers-color-scheme:dark){:root{--track:rgba(160,160,160,.18);--up:#4cd27c;--up-bg:rgba(76,210,124,.16);--down-bg:rgba(255,92,80,.16)}}
body{margin:0;padding:14px 14px max(12px,env(safe-area-inset-bottom));font-variant-numeric:tabular-nums}
button{font:inherit;color:inherit;margin:0;padding:0;border:0;background:none;cursor:pointer;transition:transform .12s,background-color .25s,color .25s}
button:active:not([disabled]){transform:scale(.97)}
button[disabled]{cursor:default}
h3{margin:0;font-size:18px;line-height:1.3;font-weight:650;overflow-wrap:anywhere}
.hint{color:var(--hint);font-size:13px}
.kicker{color:var(--hint);font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase}
.foot{min-height:18px;margin-top:10px;padding-right:var(--tg-content-safe-area-corner-right,0px);color:var(--hint);font-size:13px}
.primary{display:block;width:100%;padding:11px 0;border-radius:12px;background:var(--accent);color:var(--on-accent);font-weight:600}
`)
