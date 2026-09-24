import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  GitPullRequest, 
  GitBranch, 
  Server, 
  Box, 
  CheckCircle2, 
  Play, 
  Copy, 
  Check, 
  ExternalLink, 
  Download, 
  Terminal,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DeploymentHub = () => {
  const { activeTrack, currentUser } = useApp();
  const [selectedProject, setSelectedProject] = useState('shopsphere');
  const [copiedType, setCopiedType] = useState(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [pipelineSteps, setPipelineSteps] = useState([
    { name: '1. Lint & Static Analysis (SonarQube)', status: 'WAITING', time: '' },
    { name: '2. Unit & Integration Tests (JUnit / PyTest)', status: 'WAITING', time: '' },
    { name: '3. Multi-Stage Docker Container Build', status: 'WAITING', time: '' },
    { name: '4. Security Vulnerability Scan (Trivy)', status: 'WAITING', time: '' },
    { name: '5. Zero-Downtime Cloud Deployment (AWS ECS / Render)', status: 'WAITING', time: '' }
  ]);
  const [deployedUrl, setDeployedUrl] = useState(null);

  const githubUser = currentUser ? currentUser.githubUsername : 'alexsharma-dev';

  const dockerfiles = {
    java: `# Multi-stage Dockerfile for Spring Boot 3.3
# Stage 1: Build & Package
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /workspace
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal Distroless / Alpine Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
COPY --from=builder /workspace/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-XX:+UseG1GC", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]`,

    python: `# Multi-stage Dockerfile for FastAPI / Python 3.12
FROM python:3.12-slim-bookworm AS builder
WORKDIR /app
ENV PYTHONUNBUFFERED=1 \\
    PYTHONDONTWRITEBYTECODE=1
RUN apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Final Minimal Production Image
FROM python:3.12-slim-bookworm
WORKDIR /app
RUN useradd -u 1001 -m appuser
USER appuser
COPY --from=builder /root/.local /home/appuser/.local
ENV PATH=/home/appuser/.local/bin:$PATH
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]`
  };

  const githubActionsWorkflow = `# .github/workflows/deploy.yml
name: Full Stack Universe CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code Repository
        uses: actions/checkout@v4

      - name: Setup Java/Python Toolchain
        uses: ${activeTrack === 'java' ? 'actions/setup-java@v4\n        with:\n          distribution: "temurin"\n          java-version: "21"' : 'actions/setup-python@v5\n        with:\n          python-version: "3.12"'}

      - name: Run Automated Test Suites
        run: ${activeTrack === 'java' ? 'mvn test' : 'pytest -v --cov=app'}

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}

      - name: Build and Push Docker Image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ghcr.io/\${{ github.repository }}:latest`;

  const dockerComposeYaml = `version: '3.8'

services:
  backend:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/kapil_prod
      - SPRING_REDIS_HOST=cache
    depends_on:
      - db
      - cache

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=secure_master_password
      - POSTGRES_DB=kapil_prod
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  cache:
    image: redis:7.2-alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:`;

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const triggerLivePipeline = () => {
    setIsDeploying(true);
    setDeployedUrl(null);
    setPipelineSteps([
      { name: '1. Lint & Static Analysis (SonarQube)', status: 'RUNNING', time: 'Executing...' },
      { name: '2. Unit & Integration Tests (JUnit / PyTest)', status: 'WAITING', time: '' },
      { name: '3. Multi-Stage Docker Container Build', status: 'WAITING', time: '' },
      { name: '4. Security Vulnerability Scan (Trivy)', status: 'WAITING', time: '' },
      { name: '5. Zero-Downtime Cloud Deployment (AWS ECS / Render)', status: 'WAITING', time: '' }
    ]);

    setTimeout(() => {
      setPipelineSteps(prev => [
        { ...prev[0], status: 'PASS', time: '1.8s' },
        { ...prev[1], status: 'RUNNING', time: 'Executing...' },
        prev[2], prev[3], prev[4]
      ]);
    }, 700);

    setTimeout(() => {
      setPipelineSteps(prev => [
        prev[0],
        { ...prev[1], status: 'PASS', time: '3.4s' },
        { ...prev[2], status: 'RUNNING', time: 'Compiling Docker layers...' },
        prev[3], prev[4]
      ]);
    }, 1500);

    setTimeout(() => {
      setPipelineSteps(prev => [
        prev[0], prev[1],
        { ...prev[2], status: 'PASS', time: '4.1s' },
        { ...prev[3], status: 'RUNNING', time: 'Scanning CVE database...' },
        prev[4]
      ]);
    }, 2300);

    setTimeout(() => {
      setPipelineSteps(prev => [
        prev[0], prev[1], prev[2],
        { ...prev[3], status: 'PASS', time: '1.2s' },
        { ...prev[4], status: 'RUNNING', time: 'Routing traffic...' }
      ]);
    }, 3100);

    setTimeout(() => {
      setPipelineSteps(prev => [
        prev[0], prev[1], prev[2], prev[3],
        { ...prev[4], status: 'PASS', time: '2.1s' }
      ]);
      setIsDeploying(false);
      const url = `https://${selectedProject}-${githubUser}.fullstack-universe.app`;
      setDeployedUrl(url);
      try {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      } catch (e) { }
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-2">
            <GitPullRequest className="w-3.5 h-3.5" />
            <span>DEPLOYMENT HUB · GITHUB & CI/CD PIPELINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            GitHub Portfolio & Production Cloud Deployment
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Save and containerize your MVPs with multi-stage Docker builds, automated GitHub Actions workflows, and live cloud deployment simulation.
          </p>
        </div>

        {/* GitHub Linked Badge */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3">
          <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
          <div className="text-xs font-mono">
            <div className="text-slate-400 text-[10px]">Connected Repository Owner</div>
            <div className="text-sky-400 font-bold">github.com/{githubUser}</div>
          </div>
        </div>
      </div>

      {/* Project Selector & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Production Configurations & Scripts */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Box className="w-4 h-4 text-sky-400" />
                <span>Production Containerization Artifacts</span>
              </h3>
              
              <div className="flex gap-2">
                {['shopsphere', 'fincore', 'mediflow', 'campusos'].map(p => (
                  <button
                    key={p}
                    onClick={() => setSelectedProject(p)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono uppercase transition ${
                      selectedProject === p 
                        ? 'bg-sky-600 text-white font-bold' 
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Dockerfile Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Dockerfile (Multi-Stage Distroless Build)</span>
                <button
                  onClick={() => handleCopy(dockerfiles[activeTrack], 'docker')}
                  className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 px-2 py-0.5 rounded transition"
                >
                  {copiedType === 'docker' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedType === 'docker' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-52">
                <pre>{dockerfiles[activeTrack]}</pre>
              </div>
            </div>

            {/* GitHub Actions Workflow */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>.github/workflows/deploy.yml (Automated CI/CD)</span>
                <button
                  onClick={() => handleCopy(githubActionsWorkflow, 'ci')}
                  className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 px-2 py-0.5 rounded transition"
                >
                  {copiedType === 'ci' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedType === 'ci' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-48">
                <pre>{githubActionsWorkflow}</pre>
              </div>
            </div>

            {/* docker-compose.yml */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>docker-compose.yml (App + PostgreSQL + Redis)</span>
                <button
                  onClick={() => handleCopy(dockerComposeYaml, 'compose')}
                  className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 px-2 py-0.5 rounded transition"
                >
                  {copiedType === 'compose' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedType === 'compose' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-48">
                <pre>{dockerComposeYaml}</pre>
              </div>
            </div>

          </div>

        </div>

        {/* Right: Live CI/CD Pipeline Simulator */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Play className="w-4 h-4 text-emerald-400" />
                  <span>CI/CD Deployment Simulator</span>
                </h3>
                <p className="text-xs text-slate-400">Trigger simulated build, test, containerize, and deploy stages</p>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 font-mono text-xs">
              {pipelineSteps.map((step, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    {step.status === 'PASS' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    {step.status === 'RUNNING' && <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin shrink-0" />}
                    {step.status === 'WAITING' && <span className="w-2 h-2 rounded-full bg-slate-600 ml-1 mr-1 shrink-0" />}
                    <span className={step.status === 'PASS' ? 'text-white' : 'text-slate-400'}>
                      {step.name}
                    </span>
                  </div>
                  {step.time && (
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                      {step.time}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={triggerLivePipeline}
              disabled={isDeploying}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl text-xs shadow-lg shadow-cyan-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <GitPullRequest className={`w-4 h-4 ${isDeploying ? 'animate-spin' : ''}`} />
              <span>{isDeploying ? 'Pipeline Executing...' : `Deploy ${selectedProject.toUpperCase()} to Cloud`}</span>
            </button>

            {/* Deployed Live URL Card */}
            {deployedUrl && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 space-y-2 animate-fadeIn">
                <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Deployment Live & Healthy!</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  Your project is successfully containerized and published on GitHub Container Registry (ghcr.io).
                </div>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-sky-400 hover:underline pt-1"
                >
                  <span>{deployedUrl}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-xs text-slate-300 space-y-2 font-mono">
            <div className="text-amber-400 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Placement Tip on GitHub Portfolios</span>
            </div>
            <p className="text-slate-400 leading-relaxed font-sans">
              "Never show a recruiter an empty GitHub without commits or Dockerfiles. Having a working CI/CD badge, clean commit messages, and a verifiable live URL proves you understand real engineering workflows."
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
