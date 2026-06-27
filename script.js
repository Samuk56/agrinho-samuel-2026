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
  const arvoresEquiv        = Math.max(1, Math.round(co2Evitadokg / 21));  // ~21kg CO₂/árvore/ano

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
  const form = document.getElementById("contact-form");
  if (!form) return;

  const campos = {
    nome: { el: form.querySelector("#nome"), erro: form.querySelector("#erro-nome") },
    email: { el: form.querySelector("#email"), erro: form.querySelector("#erro-email") },
    mensagem: { el: form.querySelector("#mensagem"), erro: form.querySelector("#erro-mensagem") }
  };

  function limparErro(campo) {
    campo.erro.textContent = "";
    campo.el.style.borderColor = "";
  }

  function marcarErro(campo, mensagem) {
    campo.erro.textContent = mensagem;
    campo.el.style.borderColor = "var(--error)";
  }

  Object.values(campos).forEach(campo => {
    campo.el.addEventListener("input", () => limparErro(campo));
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let valido = true;

    const nome = campos.nome.el.value.trim();
    const email = campos.email.el.value.trim();
    const mensagem = campos.mensagem.el.value.trim();

    if (!nome) {
      marcarErro(campos.nome, "Informe seu nome.");
      valido = false;
    } else {
      limparErro(campos.nome);
    }

    if (!email) {
      marcarErro(campos.email, "Informe seu e-mail.");
      valido = false;
    } else if (!validarEmail(email)) {
      marcarErro(campos.email, "Informe um e-mail válido.");
      valido = false;
    } else {
      limparErro(campos.email);
    }

    if (!mensagem) {
      marcarErro(campos.mensagem, "Escreva sua mensagem.");
      valido = false;
    } else {
      limparErro(campos.mensagem);
    }

    if (!valido) {
      exibirToast("Verifique os campos destacados antes de enviar.", "warning");
      return;
    }

    // Simulação de envio bem-sucedido (não há backend neste portal)
    const btn = document.getElementById("btn-enviar");
    const textoOriginal = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      btn.innerHTML = textoOriginal;
      exibirToast("Mensagem enviada com sucesso! Obrigado pelo contato. 🚀", "success");
    }, 900);
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

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.opacity   = "1";
      toast.style.transform = "translateY(0)";
    });
  });

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
      — adiciona classe .visible às .reveal conforme entram na viewport
   -------------------------------------------------------------------------- */
function inicializarScrollReveal() {
  const elementos = document.querySelectorAll(".reveal");
  if (!elementos.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elementos.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   9. HIGHLIGHT DE LINK ATIVO NA NAV conforme seção visível
   -------------------------------------------------------------------------- */
function inicializarNavAtiva() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks  = document.querySelectorAll("nav a[href^='#']");
  if (!sections.length) return;

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
   10. CONTADOR ANIMADO para métricas (hero, sociedade, etc.)
   -------------------------------------------------------------------------- */
function animarContadores() {
  const elementos = document.querySelectorAll("[data-count]");
  if (!elementos.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const alvo = parseInt(el.dataset.count, 10);

      if (alvo === 0) {
        el.textContent = "0";
        observer.unobserve(el);
        return;
      }

      let atual  = 0;
      const duracao = 1500;
      const passo   = Math.max(1, Math.ceil(alvo / (duracao / 16)));

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

  document.querySelectorAll(".blob, .atom-spin, .particle").forEach(el => {
    el.style.animation = "none";
  });
}

/* --------------------------------------------------------------------------
   12. BARRA DE PROGRESSO DE LEITURA
   -------------------------------------------------------------------------- */
function inicializarBarraProgresso() {
  const barra = document.getElementById("scroll-progress");
  if (!barra) return;

  function atualizar() {
    const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;
    const progresso = alturaTotal > 0 ? (window.scrollY / alturaTotal) * 100 : 0;
    barra.style.width = `${progresso}%`;
  }

  window.addEventListener("scroll", atualizar, { passive: true });
  window.addEventListener("resize", atualizar);
  atualizar();
}

/* --------------------------------------------------------------------------
   13. REATOR EM CORTE — abre conforme o usuário rola até a seção
   -------------------------------------------------------------------------- */
function inicializarReatorCorte() {
  const media = document.getElementById("reactor-media");
  if (!media) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Quando a hero sai parcialmente de vista (usuário rolou para baixo),
      // o reator "abre" revelando o plasma interno.
      media.classList.toggle("is-open", entry.intersectionRatio < 0.6);
    });
  }, { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] });

  observer.observe(media);
}

/* --------------------------------------------------------------------------
   14. MENU MOBILE (hambúrguer)
   -------------------------------------------------------------------------- */
function inicializarMenuMobile() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");
  const overlay = document.getElementById("nav-overlay");
  if (!toggle || !nav || !overlay) return;

  function abrir() {
    nav.classList.add("nav-open");
    overlay.classList.add("show");
    toggle.setAttribute("aria-expanded", "true");
    toggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  }

  function fechar() {
    nav.classList.remove("nav-open");
    overlay.classList.remove("show");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }

  toggle.addEventListener("click", () => {
    nav.classList.contains("nav-open") ? fechar() : abrir();
  });

  overlay.addEventListener("click", fechar);

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", fechar);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) fechar();
  });
}

/* --------------------------------------------------------------------------
   15. BOTÃO VOLTAR AO TOPO FLUTUANTE
   -------------------------------------------------------------------------- */
function inicializarBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* --------------------------------------------------------------------------
   16. PARTÍCULAS DE PLASMA FLUTUANTES (geradas dinamicamente)
   -------------------------------------------------------------------------- */
function inicializarParticulas() {
  const container = document.getElementById("particles");
  if (!container) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const cores = ["#00f2fe", "#9d4edd", "#4facfe", "#ffb454"];
  const total = window.innerWidth < 768 ? 14 : 26;

  for (let i = 0; i < total; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const cor = cores[Math.floor(Math.random() * cores.length)];
    const left = Math.random() * 100;
    const duracao = 10 + Math.random() * 14;
    const atraso = Math.random() * 14;
    const drift = (Math.random() - 0.5) * 120;
    const tamanho = 2 + Math.random() * 3;

    p.style.left = `${left}%`;
    p.style.background = cor;
    p.style.boxShadow = `0 0 8px ${cor}, 0 0 16px ${cor}`;
    p.style.width = `${tamanho}px`;
    p.style.height = `${tamanho}px`;
    p.style.setProperty("--drift", `${drift}px`);
    p.style.animationDuration = `${duracao}s`;
    p.style.animationDelay = `${atraso}s`;

    container.appendChild(p);
  }
}

/* --------------------------------------------------------------------------
   17. SMOOTH SCROLL COM OFFSET DO HEADER (links internos)
   -------------------------------------------------------------------------- */
function inicializarSmoothScroll() {
  const header = document.querySelector("header");
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id.length <= 1) return;
      const destino = document.querySelector(id);
      if (!destino) return;

      e.preventDefault();
      const offset = (header ? header.offsetHeight : 0) + 10;
      const top = destino.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

/* --------------------------------------------------------------------------
   18. INICIALIZAÇÃO GERAL (DOMContentLoaded)
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  respeitarReducedMotion();
  inicializarHeaderScroll();
  inicializarScrollReveal();
  inicializarNavAtiva();
  inicializarRadiosCustom();
  inicializarFormularioContato();
  animarContadores();
  inicializarBarraProgresso();
  inicializarReatorCorte();
  inicializarMenuMobile();
  inicializarBackToTop();
  inicializarParticulas();
  inicializarSmoothScroll();

  console.info(
    "%c⚛ FusãoSustentável JS carregado com sucesso!",
    "color: #00f2fe; font-weight: bold; font-size: 14px;"
  );
});

/* --------------------------------------------------------------------------
   19. EXPOSIÇÃO GLOBAL das funções chamadas via addEventListener no HTML
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const btnCalcular = document.getElementById("btn-calcular");
  const btnQuiz = document.getElementById("btn-quiz");
  if (btnCalcular) btnCalcular.addEventListener("click", calcularImpacto);
  if (btnQuiz) btnQuiz.addEventListener("click", verificarQuiz);

  const inputConsumo = document.getElementById("consumo");
  if (inputConsumo) {
    inputConsumo.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        calcularImpacto();
      }
    });
  }
});