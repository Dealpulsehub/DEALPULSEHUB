# graphify-weekly-update.ps1
#
# Regenera el knowledge graph de Graphify para DealPulseHub.
# Modo code-only: solo extraccion AST local, sin llamadas a LLM (sin costo de API).
#
# Ejecutado por la tarea programada de Windows "Graphify-Weekly-Update"
# (semanal, lunes). Reconfigurada 2026-08-12 tras encontrar la version anterior
# rota (corria a diario, apuntaba a un script/carpeta que nunca existieron —
# ver memory/decision-obsidian-discontinuado.md y
# memory/analisis-megabrain-memoria-orquestacion.md para el patron general
# de automatizacion desatendida que se rompe en silencio).
#
# Salida: graphify-out/ (graph.json + GRAPH_REPORT.md). Esa carpeta esta en
# .gitignore a proposito -- se regenera, no se versiona.

# NOTA (2026-08-12): usar SIEMPRE la ruta absoluta al .exe, no el nombre "graphify"
# a secas -- via PATH, un proceso lanzado por Task Scheduler puede resolver un
# python.exe distinto (ej. el stub de Windows Store) y fallar con
# "No module named graphifyy" aunque en una shell interactiva funcione bien.
$graphify = "C:\Users\Oscar\AppData\Local\Programs\Python\Python313\Scripts\graphify.exe"

Set-Location "C:\Users\Oscar\Desktop\DealPulseHub"

$logFile = "C:\Users\Oscar\Desktop\DealPulseHub\graphify-out\last-run.log"
New-Item -ItemType Directory -Force -Path "C:\Users\Oscar\Desktop\DealPulseHub\graphify-out" | Out-Null

"=== Graphify weekly update: $(Get-Date -Format o) ===" | Out-File -FilePath $logFile -Encoding utf8

& $graphify extract . --code-only 2>&1 | Tee-Object -FilePath $logFile -Append
$extractOk = $LASTEXITCODE -eq 0

& $graphify cluster-only . --no-viz 2>&1 | Tee-Object -FilePath $logFile -Append
$clusterOk = $LASTEXITCODE -eq 0

if ($extractOk -and $clusterOk) {
    "=== OK: $(Get-Date -Format o) ===" | Out-File -FilePath $logFile -Append -Encoding utf8
} else {
    "=== ERROR: $(Get-Date -Format o) - extract exit=$LASTEXITCODE ===" | Out-File -FilePath $logFile -Append -Encoding utf8
    exit 1
}
