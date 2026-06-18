/* ==========================================================================
   SCRIPT.JS — Portal Educativo: Fusão Sustentável
   Agrinho 2026 | Separação total de responsabilidades (HTML / CSS / JS)
   ========================================================================== */

"use strict";

/* --------------------------------------------------------------------------
   1. CALCULADORA DE IMPACTO ENERGÉTICO
   -------------------------------------------------------------------------- */
function calcularImpacto() {
  const input = document.getElementById("consumo");
  const resultadoDiv = document.getElementById("calc-resultado");
  const consumo = parseFloat(input.value);

  if (!consumo || consumo <= 0) {
    exibirResultado(resultadoDiv, "error",
      '<p><i class="fa-solid fa-circle-exclamation"></i> Por favor, insira um valor válido maior que zero.</p>'
    );
    return;
  }

  const combustivelFusaomg  = (consumo * 0.012).toFixed(2);
  const carvaoEconomizadokg = (consumo * 0.35).toFixed(1);
  const co2Evitadokg        = (consumo * 0.82).toFixed(1); // ~820g CO₂/kWh (carvão)
  const arvoresEquiv        = Math.round(co2Evitadokg / 21);  // ~21kg CO₂/árvore/ano

  exibirResultado(resultadoDiv, "success", `
    <h4><i class="fa-solid fa-circle-check"></i> Resultado Estimado</h4>
    <p>Para gerar <strong>${consumo} kWh</strong>, a fusão precisaria de apenas
       <span class="highlight-text">${combustivelFusaomg} mg</span> de combustível.</p>
    <p>Isso evitaria a queima de
       <span class="highlight-text">${carvaoEconomizadokg} kg</span> de carvão mineral
       e <span class="highlight-text">${co2Evitadokg} kg</span> de CO₂ —
       equivalente ao que <span class="highlight-text">${arvoresEquiv} árvore(s)</span>
       absorvem em um ano.</p>
  `);
}

/* --------------------------------------------------------------------------
   2. QUIZ DE SUSTENTABILIDADE (multi-pergunta expansível)
   -------------------------------------------------------------------------- */
const QUIZ_GABARITO = {
  pergunta1: "correto"
};

function verificarQuiz() {
  const resultadoDiv = document.getElementById("quiz-resultado");
  const alternativas  = document.getElementsByName("pergunta1");
  let respostaSelecionada = "";

  for (const alt of alternativas) {
    if (alt.checked) { respostaSelecionada = alt.value; break; }
  }

  if (!respostaSelecionada) {
    exibirResultado(resultadoDiv, "warning",
      '<p><i class="fa-solid fa-circle-info"></i> Selecione uma opção antes de enviar.</p>'
    );
    return;
  }

  if (respostaSelecionada === QUIZ_GABARITO.pergunta1) {
    exibirResultado(resultadoDiv, "success", `
      <h4><i class="fa-solid fa-square-check"></i> Correto!</h4>
      <p>O <strong>Deutério</strong> (extraído da água do mar) e o
         <strong>Trítio</strong> fundem a temperaturas viáveis em reatores de
         confinamento magnético, liberando energia limpa sem emissões de CO₂.</p>
    `);
  } else {
    exibirResultado(resultadoDiv, "error", `
      <h4><i class="fa-solid fa-rectangle-xmark"></i> Incorreto.</h4>
      <p>Urânio e Plutônio pertencem à <em>fissão</em>; combustíveis fósseis causam
         efeito estufa. A resposta correta são os
         <strong>Isótopos de Hidrogênio (Deutério e Trítio)</strong>.</p>
    `);
  }
}

/* --------------------------------------------------------------------------
   3. VALIDAÇÃO DO FORMULÁRIO DE CONTATO
   -------------------------------------------------------------------------- */
function inicializarFormularioContato() {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nome     = form.querySelector("#nome").value.trim();
    const email    = form.querySelector("#email").value.trim();
    const mensagem = form.querySelector("#mensagem").value.trim();

    if (!nome || !email || !mensagem) {
      exibirToast("Preencha todos os campos antes de enviar.", "warning");
      return;
    }

    if (!validarEmail(email)) {
      exibirToast("Insira um e-mail válido.", "error");
      return;
    }

    // Simulação de envio bem-sucedido
    form.reset();
    exibirToast("Mensagem enviada com sucesso! Obrigado pelo contato. 🚀", "success");
  });
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* --------------------------------------------------------------------------
   4. SISTEMA DE TOAST (notificações visuais globais)
   -------------------------------------------------------------------------- */
function exibirToast(mensagem, tipo = "success") {
  const CORES = {
    success : { bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.4)",  color: "#a7f3d0", icon: "fa-circle-check"      },
    error   : { bg: "rgba(239,68,68,0.15)",  border: "rgba(239,68,68,0.4)",   color: "#fca5a5", icon: "fa-circle-xmark"      },
    warning : { bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.4)",  color: "#fde68a", icon: "fa-triangle-exclamation" }
  };

  const cfg   = CORES[tipo] || CORES.success;
  const toast = document.createElement("div");

  Object.assign(toast.style, {
    position      : "fixed",
    bottom        : "2rem",
    right         : "2rem",
    zIndex        : "9999",
    background    : cfg.bg,
    border        : `1px solid ${cfg.border}`,
    color         : cfg.color,
    padding       : "1rem 1.4rem",
    borderRadius  : "12px",
    fontSize      : "0.95rem",
    fontFamily    : "var(--font, sans-serif)",
    backdropFilter: "blur(12px)",
    display       : "flex",
    alignItems    : "center",
    gap           : "10px",
    boxShadow     : "0 8px 24px rgba(0,0,0,0.3)",
    opacity       : "0",
    transform     : "translateY(20px)",
    transition    : "opacity 0.35s ease, transform 0.35s ease",
    maxWidth      : "360px"
  });

  toast.innerHTML = `<i class="fa-solid ${cfg.icon}"></i> ${mensagem}`;
  document.body.appendChild(toast);

  // Animação de entrada
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.opacity   = "1";
      toast.style.transform = "translateY(0)";
    });
  });

  // Auto-remoção após 4 s
  setTimeout(() => {
    toast.style.opacity   = "0";
    toast.style.transform = "translateY(20px)";
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

/* --------------------------------------------------------------------------
   5. HELPER: exibir resultado inline (calculadora / quiz)
   -------------------------------------------------------------------------- */
function exibirResultado(div, tipo, html) {
  div.className = `result-box show ${tipo}`;
  div.innerHTML = html;
}

/* --------------------------------------------------------------------------
   6. RÁDIO PERSONALIZADO (quiz visual)
   -------------------------------------------------------------------------- */
function inicializarRadiosCustom() {
  document.querySelectorAll(".radio-option input").forEach(input => {
    input.addEventListener("change", function () {
      const fieldset = this.closest("fieldset");
      fieldset.querySelectorAll(".radio-option").forEach(label => {
        label.classList.remove("active");
        const icon = label.querySelector("i");
        if (icon) icon.className = "fa-regular fa-circle";
      });

      if (this.checked) {
        const label = this.closest(".radio-option");
        label.classList.add("active");
        const icon = label.querySelector("i");
        if (icon) icon.className = "fa-solid fa-circle-dot";
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. HEADER: efeito de scroll — sombra e opacidade aumentam ao rolar
   -------------------------------------------------------------------------- */
function inicializarHeaderScroll() {
  const header = document.querySelector("header");
  if (!header) return;

  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY > 30;
    header.style.background    = scrolled
      ? "rgba(7, 10, 17, 0.85)"
      : "rgba(10, 14, 23, 0.65)";
    header.style.boxShadow = scrolled
      ? "0 4px 30px rgba(0,0,0,0.4)"
      : "none";
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   8. ANIMAÇÃO DE ENTRADA POR SCROLL (Intersection Observer)
      — adiciona classe .visible às .glass-card conforme entram na viewport
   -------------------------------------------------------------------------- */
function inicializarScrollReveal() {
  const cards = document.querySelectorAll(".glass-card, .inner-card, .metric-card");

  // CSS inline de estado inicial (para não poluir o CSS externo com estado JS)
  cards.forEach(card => {
    card.style.opacity   = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  cards.forEach(card => observer.observe(card));
}

/* --------------------------------------------------------------------------
   9. HIGHLIGHT DE LINK ATIVO NA NAV conforme seção visível
   -------------------------------------------------------------------------- */
function inicializarNavAtiva() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks  = document.querySelectorAll("nav a[href^='#']");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach(link => {
          link.classList.toggle("nav-ativa", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });

  sections.forEach(s => observer.observe(s));

  // Injeta estilo para classe .nav-ativa
  const style = document.createElement("style");
  style.textContent = `
    nav a.nav-ativa {
      color: var(--neon-cyan) !important;
      background: rgba(0,242,254,0.08) !important;
    }
  `;
  document.head.appendChild(style);
}

/* --------------------------------------------------------------------------
   10. CONTADOR ANIMADO para métricas da seção #futuro
   -------------------------------------------------------------------------- */
function animarContadores() {
  // Exemplo: se futuramente o HTML tiver elementos [data-count], eles animam.
  const elementos = document.querySelectorAll("[data-count]");
  if (!elementos.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const alvo = parseInt(el.dataset.count, 10);
      let atual  = 0;
      const duracao = 1500;
      const passo   = Math.ceil(alvo / (duracao / 16));

      const tick = () => {
        atual = Math.min(atual + passo, alvo);
        el.textContent = atual.toLocaleString("pt-BR");
        if (atual < alvo) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  elementos.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   11. ACESSIBILIDADE: respeitar prefers-reduced-motion
   -------------------------------------------------------------------------- */
function respeitarReducedMotion() {
  const prefersReduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReduzido) return;

  // Desativa animações dos blobs e do átomo
  document.querySelectorAll(".blob, .atom-spin").forEach(el => {
    el.style.animation = "none";
  });
}

/* --------------------------------------------------------------------------
   12. INICIALIZAÇÃO GERAL (DOMContentLoaded)
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  respeitarReducedMotion();
  inicializarHeaderScroll();
  inicializarScrollReveal();
  inicializarNavAtiva();
  inicializarRadiosCustom();
  inicializarFormularioContato();
  animarContadores();

  console.info(
    "%c⚛ FusãoSustentável JS carregado com sucesso!",
    "color: #00f2fe; font-weight: bold; font-size: 14px;"
  );
});

/* --------------------------------------------------------------------------
   13. EXPOSIÇÃO GLOBAL das funções chamadas via onclick no HTML
       (enquanto os atributos onclick permanecerem no HTML, isso é necessário)
   -------------------------------------------------------------------------- */
window.calcularImpacto = calcularImpacto;
window.verificarQuiz   = verificarQuiz;
