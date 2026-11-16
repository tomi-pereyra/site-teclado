# Logitech MX Keys S — Experiência Master Series

Este projeto foi desenvolvido utilizando as diretrizes de direção de arte e design anti-slop da **[Taste-Skill v2](https://github.com/Leonxlnx/taste-skill)**, transformando as informações oficiais do teclado [Logitech MX Keys S](https://www.logitech.com/pt-br/shop/p/mx-keys-s.920-011563) em uma experiência digital imersiva, tátil e focada no estado de flow.

---

## 💎 Pilares de Design (Taste-Skill)

1. **Direção de Arte Intencional (Sem AI Slop):**
   - Zero cartões genéricos ou gradientes lilases sem propósito.
   - Estética inspirada na engenharia mecânica da Logitech Master Series: tons de grafite profundo (`#090B0E`, `#101318`), bordas metálicas em alumínio usinado e acentos luminescentes em verde elétrico (`#00F0A0`) e ciano.
   - Escala tipográfica editorial com *Plus Jakarta Sans* e *JetBrains Mono*, com tracking condensado nas manchetes (`letter-spacing: -0.04em`).

2. **Substância & Fidelidade Técnica:**
   - Dados reais extraídos diretamente da ficha de engenharia da Logitech: dimensões milimétricas (131,63 x 430,2 x 20,5 mm), peso de estabilidade (810g), bateria Li-Po 1500 mAh, criptografia FIPS no receptor Logi Bolt™, pegada de carbono certificada (15,87 kg CO₂e) e percentuais de plástico pós-consumo reciclado (PCR).

3. **Interatividade Tátil em Tempo Real:**
   - **Hero Section Travada com Vídeo 3D Controlado por Scroll:** O vídeo de explosão/desconstrução mecânica do teclado fica travado no centro da tela enquanto você rola a página. Rolando para baixo o vídeo avança desconstruindo o teclado em camadas; rolando para cima o vídeo volta. A tela permanece travada até o término da desconstrução (420vh), liberando então o fluxo normal para as demais seções.
   - **Otimização All-Intra Keyframes com FFmpeg:** O vídeo foi re-codificado para que cada um dos 144 frames seja um I-frame (keyframe puro), garantindo scrubbing 60fps sem engasgos ou atrasos de decodificação no navegador.
   - **HUD Dinâmico de Camadas:** Marcadores flutuantes indicam em tempo real as camadas internas (Teclas Côncavas, Scissor-Switch Damped, Sensores e Chassi de Aço de 810g).
   - **Simulador Acústico Scissor-Switch (Web Audio API):** Gera em tempo real o som amortecido do clique mecânico das teclas de perfil baixo e ressonância da placa metálica interna, sem depender de arquivos de áudio externos.
   - **Estúdio de Perspectiva 360° & Cores:** Alterne entre *Grafite* (SKU 920-011563) e *Cinza-Claro (Pale Gray)* (SKU 920-011564) com atualização de imagens oficiais em alta definição e especificações de sustentabilidade.
   - **Simulador de Smart Actions (Logi Options+):** Terminal interativo que simula o disparo de macros (Dev Flow, Modo Reunião, Design Sprint) com progresso e feedback visual.
   - **Easy-Switch Multi-OS:** Comutação interativa entre macOS, Windows 11 e iPadOS/Linux.

---

## 🚀 Como Visualizar o Site

Por ser construído com tecnologias web puras (HTML5 semântico, CSS3 sob medida e JavaScript nativo), basta abrir o arquivo `index.html` em qualquer navegador:

- **Opção 1:** Dê dois cliques em `index.html` no Windows Explorer.
- **Opção 2:** Abra com extensões como o **Live Server** no VS Code.
- **Opção 3:** Inicie qualquer servidor estático local:
  ```bash
  # Exemplo com npx (se Node/npm estiver instalado):
  npx serve .
  ```

---

## 📁 Estrutura de Arquivos

- `index.html`: Marcação semântica com metatags completas, acessibilidade e estrutura de seções.
- `style.css`: Folha de estilo com tokens de cor, animações táteis, profundidade visual e efeitos de vidro fosco (glassmorphism).
- `app.js`: Mecanismo de proximidade, sintetizador de som Web Audio API, comutador de modelos/ângulos e motor de Smart Actions.

