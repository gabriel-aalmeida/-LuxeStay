
document.addEventListener("DOMContentLoaded", () => {
    const checkin = document.getElementById("checkin");
    const checkout = document.getElementById("checkout");
    const formulario = document.querySelector(".formulario-busca");

    if (!checkin || !checkout || !formulario) return;

    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    const dataHoje = `${ano}-${mes}-${dia}`;

    checkin.min = dataHoje;
    checkout.min = dataHoje;

    checkin.addEventListener("change", () => {
        if (!checkin.value) return;

        const proximoDia = new Date(`${checkin.value}T12:00:00`);
        proximoDia.setDate(proximoDia.getDate() + 1);

        const novaData = [
            proximoDia.getFullYear(),
            String(proximoDia.getMonth() + 1).padStart(2, "0"),
            String(proximoDia.getDate()).padStart(2, "0")
        ].join("-");

        checkout.min = novaData;

        if (checkout.value && checkout.value <= checkin.value) {
            checkout.value = "";
        }
    });

    formulario.addEventListener("submit", (evento) => {
        if (checkout.value <= checkin.value) {
            evento.preventDefault();
            alert("O check-out deve ser posterior ao check-in.");
        }
    });
});

/* ===== CATÁLOGO DE HOSPEDAGENS ===== */

const hospedagens = [
    {
        id: 1,
        nome: "Royal Tulip Brasília Alvorada",
        categoria: "Luxo",
        cidade: "Brasília",
        localizacao: "Lago Paranoá, Brasília - DF",
        descricao: "Hotel sofisticado às margens do Lago Paranoá, com piscinas e spa.",
        preco: 890,
        capacidade: 3,
        imagem: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900"
    },
    {
        id: 2,
        nome: "Brasília Palace Hotel",
        categoria: "Arquitetura",
        cidade: "Brasília",
        localizacao: "Setor de Hotéis e Turismo Norte",
        descricao: "Um ícone da arquitetura modernista de Oscar Niemeyer.",
        preco: 540,
        capacidade: 2,
        imagem: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=900"
    },
    {
        id: 3,
        nome: "B Hotel Brasília",
        categoria: "Executivo",
        cidade: "Brasília",
        localizacao: "Setor Hoteleiro Norte, Asa Norte",
        descricao: "Design contemporâneo, localização central e piscina na cobertura.",
        preco: 1050,
        capacidade: 2,
        imagem: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900"
    }
];

const listaHospedagens = document.getElementById("lista-hospedagens");

if (listaHospedagens) {
    const parametros = new URLSearchParams(window.location.search);

    const destino = parametros.get("destino") || "";
    const hospedes = Number(parametros.get("hospedes")) || 1;
    const checkin = parametros.get("checkin");
    const checkout = parametros.get("checkout");

    const filtroTipo = document.getElementById("filtro-tipo");
    const resumoBusca = document.getElementById("resumo-busca");
    const quantidade = document.getElementById("quantidade-resultados");

    const normalizar = (texto) =>
        texto.normalize("NFD")
             .replace(/[\u0300-\u036f]/g, "")
             .toLowerCase()
             .trim();

    if (destino) {
        resumoBusca.textContent =
            `Pesquisa: ${destino} • ${hospedes} hóspede(s)` +
            (checkin && checkout ? ` • ${checkin} até ${checkout}` : "");
    }

    function mostrarHospedagens() {
        const categoria = filtroTipo.value;

        const resultados = hospedagens.filter((hotel) => {
            const categoriaValida =
                categoria === "todos" || hotel.categoria === categoria;

            const destinoValido =
                !destino ||
                normalizar(destino).includes(normalizar(hotel.cidade)) ||
                normalizar(hotel.cidade).includes(normalizar(destino)) ||
                normalizar(destino) === "df";

            const capacidadeValida = hotel.capacidade >= hospedes;

            return categoriaValida && destinoValido && capacidadeValida;
        });

        quantidade.textContent =
            `${resultados.length} hospedagem(ns) encontrada(s)`;

        if (resultados.length === 0) {
            listaHospedagens.innerHTML =
                "<p>Nenhuma hospedagem encontrada. Tente outros filtros.</p>";
            return;
        }

       

        listaHospedagens.innerHTML = resultados.map((hotel) => `
            <article class="card-hospedagem">
                <div class="card-imagem">
                    <img
                        src="${hotel.imagem}"
                        alt="Imagem ilustrativa de hospedagem, não do hotel anunciado"
                        loading="lazy"
                    >
                    <span class="selo-hotel">${hotel.categoria}</span>
                </div>

                <div class="card-conteudo">
                    <p class="card-localizacao">
                        📍 ${hotel.localizacao}
                    </p>

                    <h2>${hotel.nome}</h2>

                    <p class="card-descricao">${hotel.descricao}</p>

                    <div class="card-comodidades">
                        <span>✓ Wi-Fi</span>
                        <span>✓ Conforto</span>
                    </div>

                    <div class="card-rodape">
                        <p class="preco-legenda">Diárias a partir de</p>

                        <p class="card-preco">
                            ${hotel.preco.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL"
                            })}
                            <span>/ noite</span>
                        </p>

                        <p class="card-aviso">Valor ilustrativo</p>

                        <a href="detalhes.html?id=${hotel.id}"
                           class="card-botao">
                            Ver detalhes
                        </a>
                    </div>
                </div>
            </article>
        `).join("");

    }

    filtroTipo.addEventListener("change", mostrarHospedagens);
    mostrarHospedagens();
}

/* ===== CARROSSEL BLACK FRIDAY ===== */

const carrossel = document.getElementById("carrossel-promocoes");

if (carrossel) {
    const slides = Array.from(
        carrossel.querySelectorAll(".slide-promocao")
    );

    const indicadores = Array.from(
        carrossel.querySelectorAll(".indicador")
    );

    const botaoAnterior = carrossel.querySelector(".anterior");
    const botaoProximo = carrossel.querySelector(".proximo");

    let slideAtual = 0;
    let intervalo;

    function mostrarSlide(indice) {
        slideAtual = (indice + slides.length) % slides.length;

        slides.forEach((slide, i) => {
            const ativo = i === slideAtual;

            slide.classList.toggle("ativo", ativo);
            slide.setAttribute("aria-hidden", String(!ativo));
            slide.inert = !ativo;

            indicadores[i].classList.toggle("ativo", ativo);
            indicadores[i].setAttribute(
                "aria-current", ativo ? "true" : "false"
            );
        });
    }

    function pararAutomatico() {
        clearInterval(intervalo);
    }

    function iniciarAutomatico() {
        pararAutomatico();

        if (window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches) return;

        intervalo = setInterval(() => {
            mostrarSlide(slideAtual + 1);
        }, 5000);
    }

    botaoProximo.addEventListener("click", () => {
        mostrarSlide(slideAtual + 1);
        iniciarAutomatico();
    });

    botaoAnterior.addEventListener("click", () => {
        mostrarSlide(slideAtual - 1);
        iniciarAutomatico();
    });

    indicadores.forEach((indicador, indice) => {
        indicador.addEventListener("click", () => {
            mostrarSlide(indice);
            iniciarAutomatico();
        });
    });

    carrossel.addEventListener("mouseenter", pararAutomatico);
    carrossel.addEventListener("mouseleave", iniciarAutomatico);
    carrossel.addEventListener("focusin", pararAutomatico);

    carrossel.addEventListener("focusout", (evento) => {
        if (!carrossel.contains(evento.relatedTarget)) {
            iniciarAutomatico();
        }
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            pararAutomatico();
        } else {
            iniciarAutomatico();
        }
    });

    mostrarSlide(0);
    iniciarAutomatico();
}

/* ===== DETALHES DA HOSPEDAGEM ===== */

const areaDetalhes = document.getElementById("detalhes-hotel");

if (areaDetalhes) {
    const parametrosDetalhes = new URLSearchParams(
        window.location.search
    );

    const idHotel = Number(parametrosDetalhes.get("id"));

    const hotelSelecionado = hospedagens.find(
        (hotel) => hotel.id === idHotel
    );

    if (!hotelSelecionado) {
        areaDetalhes.innerHTML = `
            <div class="detalhes-erro">
                <h1>Hospedagem não encontrada</h1>
                <p>Não conseguimos localizar o hotel solicitado.</p>
                <a href="hospedagens.html" class="card-botao">
                    Ver hospedagens
                </a>
            </div>
        `;
    } else {
        const precoFormatado = hotelSelecionado.preco.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

        document.title = `${hotelSelecionado.nome} | LuxeStay`;

        areaDetalhes.innerHTML = `
            <div class="detalhes-cabecalho">
                <p class="etiqueta-secao">
                    ${hotelSelecionado.categoria}
                </p>

                <h1>${hotelSelecionado.nome}</h1>

                <p>📍 ${hotelSelecionado.localizacao}</p>
            </div>

            <div class="detalhes-imagem">
                <img
                    src="${hotelSelecionado.imagem}"
                    alt="Imagem ilustrativa da hospedagem"
                >
            </div>

            <div class="detalhes-grid">
                <div class="detalhes-informacoes">
                    <h2>Sobre esta hospedagem</h2>

                    <p>${hotelSelecionado.descricao}</p>

                    <h3>Comodidades</h3>

                    <div class="card-comodidades">
                        <span>✓ Wi-Fi</span>
                        <span>✓ Conforto</span>
                    </div>

                    <p>
                        Capacidade cadastrada:
                        até ${hotelSelecionado.capacidade} hóspedes.
                    </p>
                </div>

                <aside class="detalhes-reserva">
                    <p>Diárias a partir de</p>

                    <p class="detalhes-preco">
                        ${precoFormatado}
                        <span>/ noite</span>
                    </p>

                    <p class="card-aviso">
                        Valor ilustrativo para fins acadêmicos.
                    </p>

                    <a
                        href="reserva.html?id=${hotelSelecionado.id}"
                        class="card-botao"
                    >
                        Reservar agora
                    </a>
                </aside>
            </div>
        `;
    }
}
