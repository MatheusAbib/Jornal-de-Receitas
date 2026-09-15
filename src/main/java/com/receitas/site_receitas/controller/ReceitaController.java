package com.receitas.site_receitas.controller;

import com.receitas.site_receitas.model.Receita;
import com.receitas.site_receitas.model.Receita.StatusReceita;
import com.receitas.site_receitas.repository.ReceitaRepository;
import com.receitas.site_receitas.model.Usuario;
import com.receitas.site_receitas.repository.UsuarioRepository;
import com.receitas.site_receitas.model.CarrosselItem;
import com.receitas.site_receitas.repository.CarrosselRepository;
import com.receitas.site_receitas.service.SiteConfigService;
import com.receitas.site_receitas.model.Notificacao;
import com.receitas.site_receitas.repository.NotificacaoRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class ReceitaController {

    private final ReceitaRepository repository;
    private final UsuarioRepository usuarioRepository;

    @Autowired
    private NotificacaoRepository notificacaoRepository;

    @Autowired
    private CarrosselRepository carrosselRepository;

    @Autowired
    private SiteConfigService siteConfigService;

    public ReceitaController(
            ReceitaRepository repository,
            UsuarioRepository usuarioRepository) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping("/")
    public String index(
            Model model,
            Authentication authentication) {

        if (authentication != null
                && authentication.isAuthenticated()
                && !"anonymousUser".equals(authentication.getName())) {

            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

            if (isAdmin) {
                return "redirect:/usuarios";
            }
        }

        model.addAttribute("paginaAtual", "inicio");

        model.addAttribute(
                "receitas",
                repository.findByStatus(StatusReceita.APROVADA)
        );

        List<CarrosselItem> carrosselItens =
                carrosselRepository.findByAtivoTrueOrderByOrdemExibicaoAsc();

        model.addAttribute("carrosselItens", carrosselItens);

        String faviconUrl =
                siteConfigService.getConfigValue("favicon_url");

        String ganacheUrl =
                siteConfigService.getConfigValue("ganache_url");

        String sopaUrl =
                siteConfigService.getConfigValue("sopa_url");

        String pestoUrl =
                siteConfigService.getConfigValue("pesto_url");

        String bolinhoUrl =
                siteConfigService.getConfigValue("bolinho_url");

        model.addAttribute("faviconUrl", faviconUrl);
        model.addAttribute("ganacheUrl", ganacheUrl);
        model.addAttribute("sopaUrl", sopaUrl);
        model.addAttribute("pestoUrl", pestoUrl);
        model.addAttribute("bolinhoUrl", bolinhoUrl);

        if (authentication != null
                && authentication.isAuthenticated()
                && !authentication.getName().equals("anonymousUser")) {

            String email = authentication.getName();

            Optional<Usuario> usuario =
                    usuarioRepository.findByEmail(email);

            if (usuario.isPresent()) {
                model.addAttribute(
                        "nomeUsuario",
                        usuario.get().getNome()
                );
            } else {
                model.addAttribute(
                        "nomeUsuario",
                        email
                );
            }
        }

        return "principal/index";
    }

    @GetMapping("/nova")
    public String novaReceitaForm(Model model) {

        model.addAttribute("paginaAtual", "nova");

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication.getName().equals("anonymousUser")) {

            return "redirect:/";
        }

        String email = authentication.getName();

        Optional<Usuario> usuarioOpt =
                usuarioRepository.findByEmail(email);

        Receita receita = new Receita();

        receita.setPorcoes(1);

        if (usuarioOpt.isPresent()) {
            receita.setChefe(usuarioOpt.get().getNome());
        } else {
            receita.setChefe(email);
        }

        model.addAttribute("receita", receita);

        if (usuarioOpt.isPresent()) {
            model.addAttribute(
                    "nomeUsuario",
                    usuarioOpt.get().getNome()
            );
        } else {
            model.addAttribute(
                    "nomeUsuario",
                    email
            );
        }

        String faviconUrl =
                siteConfigService.getFaviconUrl();

        model.addAttribute(
                "faviconUrl",
                faviconUrl
        );

        return "principal/receita/form-receita";
    }

    @PostMapping("/salvar")
    public String salvarReceita(
            @ModelAttribute Receita receita,
            @RequestParam("imagemFile") MultipartFile imagemFile,
            @RequestParam(
                    required = false,
                    name = "ingredientes[]"
            ) List<String> ingredientes,
            @RequestParam(
                    required = false,
                    name = "modoPreparo[]"
            ) List<String> modoPreparo,
            RedirectAttributes redirectAttributes) throws Exception {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication.getName().equals("anonymousUser")) {

            return "redirect:/";
        }

        String email = authentication.getName();

        Optional<Usuario> usuarioOpt =
                usuarioRepository.findByEmail(email);

        if (usuarioOpt.isPresent()) {

            receita.setUsuario(usuarioOpt.get());

            if (receita.getChefe() == null
                    || receita.getChefe().isBlank()) {

                receita.setChefe(
                        usuarioOpt.get().getNome()
                );
            }

        } else {

            if (receita.getChefe() == null
                    || receita.getChefe().isBlank()) {

                receita.setChefe(email);
            }
        }

        if (ingredientes != null) {

            receita.setIngredientes(
                    ingredientes.stream()
                            .map(String::trim)
                            .filter(s -> !s.isEmpty())
                            .reduce((a, b) -> a + "||" + b)
                            .orElse("")
            );
        }

        if (modoPreparo != null) {

            receita.setModoPreparo(
                    modoPreparo.stream()
                            .map(String::trim)
                            .filter(s -> !s.isEmpty())
                            .reduce((a, b) -> a + "||" + b)
                            .orElse("")
            );
        }

        if (!imagemFile.isEmpty()) {

            String uploadDir = "uploads/";

            Files.createDirectories(
                    Paths.get(uploadDir)
            );

            String filename =
                    System.currentTimeMillis()
                            + "_"
                            + imagemFile.getOriginalFilename();

            Files.write(
                    Paths.get(uploadDir, filename),
                    imagemFile.getBytes()
            );

            receita.setImagem(filename);
        }

        receita.setStatus(StatusReceita.PENDENTE);

        repository.save(receita);

        /*
         * NOTIFICAÇÃO PARA OS ADMINISTRADORES
         *
         * O administrador que também for o autor da receita
         * não recebe a notificação de aprovação da própria receita.
         */
        List<Usuario> administradores =
                usuarioRepository.findByRole("ADMIN");

        for (Usuario admin : administradores) {

            if (receita.getUsuario() != null
                    && admin.getId().equals(receita.getUsuario().getId())) {

                continue;
            }

            Notificacao notificacaoAdmin =
                    new Notificacao(
                            admin,
                            "Nova receita enviada para aprovação: \""
                                    + receita.getTitulo()
                                    + "\".",
                            Notificacao.TipoNotificacao.NOVA_RECEITA
                    );

            notificacaoRepository.save(notificacaoAdmin);
        }

        /*
         * NOTIFICAÇÃO PARA O AUTOR DA RECEITA
         */
        if (receita.getUsuario() != null) {

            Notificacao notificacaoAutor =
                    new Notificacao(
                            receita.getUsuario(),
                            "Sua receita \""
                                    + receita.getTitulo()
                                    + "\" foi enviada para aprovação.",
                            Notificacao.TipoNotificacao.NOVA_RECEITA
                    );

            notificacaoRepository.save(notificacaoAutor);
        }

        redirectAttributes.addFlashAttribute(
                "successMessage",
                "Receita enviada para aprovação com sucesso!"
        );

        return "redirect:/minhas-receitas?enviada=1";
    }


@GetMapping("/pendentes")
public String pendentes(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "12") int size,
        @RequestParam(required = false) String busca,
        @RequestParam(defaultValue = "pendentes") String aba,
        Model model) {

    Pageable pageable = PageRequest.of(
            page,
            size,
            Sort.by(
                    Sort.Direction.DESC,
                    "id"
            )
    );

    Page<Receita> pagina;

    StatusReceita status = "rejeitadas".equals(aba)
            ? StatusReceita.REJEITADA
            : StatusReceita.PENDENTE;

    if (busca != null && !busca.isBlank()) {
        pagina = repository.findByStatusAndTituloContainingIgnoreCase(
                status,
                busca,
                pageable
        );
    } else {
        pagina = repository.findByStatus(
                status,
                pageable
        );
    }

    long totalPendentes =
            repository.countByStatus(StatusReceita.PENDENTE);

    long totalRejeitadas =
            repository.countByStatus(StatusReceita.REJEITADA);

    model.addAttribute(
            "paginaAtual",
            "pendentes"
    );

    model.addAttribute(
            "abaAtiva",
            aba
    );

    model.addAttribute(
            "receitas",
            pagina.getContent()
    );

    model.addAttribute(
            "currentPage",
            page
    );

    model.addAttribute(
            "totalPages",
            pagina.getTotalPages()
    );

    model.addAttribute(
            "totalItems",
            pagina.getTotalElements()
    );

    model.addAttribute(
            "totalPendentes",
            totalPendentes
    );

    model.addAttribute(
            "totalRejeitadas",
            totalRejeitadas
    );

    model.addAttribute(
            "pageSize",
            size
    );

    model.addAttribute(
            "busca",
            busca
    );

    String faviconUrl =
            siteConfigService.getFaviconUrl();

    model.addAttribute(
            "faviconUrl",
            faviconUrl
    );

    return "admin/receitas-pendentes";
}




    @GetMapping("/receitas-aprovadas")
    public String receitasAprovadas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String busca,
            Model model) {

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        Sort.by(
                                Sort.Direction.ASC,
                                "titulo"
                        )
                );

        Page<Receita> pagina;

        if (busca != null && !busca.isBlank()) {

            pagina =
                    repository.findByStatusAndTituloContainingIgnoreCase(
                            StatusReceita.APROVADA,
                            busca,
                            pageable
                    );

        } else {

            pagina =
                    repository.findByStatus(
                            StatusReceita.APROVADA,
                            pageable
                    );
        }

        model.addAttribute(
                "paginaAtual",
                "receitas-aprovadas"
        );

        model.addAttribute(
                "receitas",
                pagina.getContent()
        );

        model.addAttribute(
                "currentPage",
                page
        );

        model.addAttribute(
                "totalPages",
                pagina.getTotalPages()
        );

        model.addAttribute(
                "totalItems",
                pagina.getTotalElements()
        );

        model.addAttribute(
                "pageSize",
                size
        );

        model.addAttribute(
                "busca",
                busca
        );

        String faviconUrl =
                siteConfigService.getFaviconUrl();

        model.addAttribute(
                "faviconUrl",
                faviconUrl
        );

        return "admin/receitas-aprovadas";
    }

    @GetMapping("/receitas-aprovadas/{id}/detalhes")
    public String detalhesFragmento(
            @PathVariable Long id,
            Model model) {

        Receita receita =
                repository.findById(id).orElse(null);

        if (receita == null) {
            return "redirect:/receitas-aprovadas";
        }

        List<String> ingredientesList =
                receita.getIngredientes() != null
                        ? Arrays.stream(
                                receita.getIngredientes()
                                        .split("\\|\\|")
                        )
                        .filter(s -> !s.isEmpty())
                        .toList()
                        : List.of();

        List<String> modoPreparoList =
                receita.getModoPreparo() != null
                        ? Arrays.stream(
                                receita.getModoPreparo()
                                        .split("\\|\\|")
                        )
                        .filter(s -> !s.isEmpty())
                        .toList()
                        : List.of();

        model.addAttribute(
                "receita",
                receita
        );

        model.addAttribute(
                "ingredientesList",
                ingredientesList
        );

        model.addAttribute(
                "modoPreparoList",
                modoPreparoList
        );

        return "admin/modais/visualizar-receita-admin :: conteudo";
    }

    @GetMapping("/pendentes/{id}/detalhes")
    public String detalhesFragmentoPendente(
            @PathVariable Long id,
            Model model) {

        Receita receita =
                repository.findById(id).orElse(null);

        if (receita == null) {
            return "redirect:/pendentes";
        }

        List<String> ingredientesList =
                receita.getIngredientes() != null
                        ? Arrays.stream(
                                receita.getIngredientes()
                                        .split("\\|\\|")
                        )
                        .filter(s -> !s.isEmpty())
                        .toList()
                        : List.of();

        List<String> modoPreparoList =
                receita.getModoPreparo() != null
                        ? Arrays.stream(
                                receita.getModoPreparo()
                                        .split("\\|\\|")
                        )
                        .filter(s -> !s.isEmpty())
                        .toList()
                        : List.of();

        model.addAttribute(
                "receita",
                receita
        );

        model.addAttribute(
                "ingredientesList",
                ingredientesList
        );

        model.addAttribute(
                "modoPreparoList",
                modoPreparoList
        );

        return "admin/modais/visualizar-receita-admin :: conteudo";
    }

    @PostMapping("/pendentes/editar/{id}")
    public String editarReceitaPendente(
            @PathVariable Long id,
            @ModelAttribute Receita receita,
            @RequestParam(
                    value = "imagemFile",
                    required = false
            ) MultipartFile imagemFile,
            @RequestParam(
                    value = "ingredientes[]",
                    required = false
            ) List<String> ingredientes,
            @RequestParam(
                    value = "modoPreparo[]",
                    required = false
            ) List<String> modoPreparo) throws Exception {

        Receita existente =
                repository.findById(id).orElse(null);

        if (existente == null) {
            return "redirect:/pendentes";
        }

        existente.setTitulo(
                receita.getTitulo()
        );

        existente.setChefe(
                receita.getChefe()
        );

        existente.setTempoPreparo(
                receita.getTempoPreparo()
        );

        existente.setPorcoes(
                receita.getPorcoes()
        );

        existente.setCategoria(
                receita.getCategoria()
        );

        if (ingredientes != null) {

            existente.setIngredientes(
                    ingredientes.stream()
                            .map(String::trim)
                            .filter(s -> !s.isEmpty())
                            .reduce((a, b) -> a + "||" + b)
                            .orElse("")
            );
        }

        if (modoPreparo != null) {

            existente.setModoPreparo(
                    modoPreparo.stream()
                            .map(String::trim)
                            .filter(s -> !s.isEmpty())
                            .reduce((a, b) -> a + "||" + b)
                            .orElse("")
            );
        }

        if (imagemFile != null
                && !imagemFile.isEmpty()) {

            String uploadDir = "uploads/";

            Files.createDirectories(
                    Paths.get(uploadDir)
            );

            String filename =
                    System.currentTimeMillis()
                            + "_"
                            + imagemFile.getOriginalFilename();

            Files.write(
                    Paths.get(uploadDir, filename),
                    imagemFile.getBytes()
            );

            existente.setImagem(filename);
        }

        repository.save(existente);

        return "redirect:/pendentes?ok=editada";
    }

    @PostMapping("/receitas-aprovadas/editar/{id}")
    public String editarReceitaAprovada(
            @PathVariable Long id,
            @ModelAttribute Receita receita,
            @RequestParam(
                    value = "imagemFile",
                    required = false
            ) MultipartFile imagemFile,
            @RequestParam(
                    value = "ingredientes[]",
                    required = false
            ) List<String> ingredientes,
            @RequestParam(
                    value = "modoPreparo[]",
                    required = false
            ) List<String> modoPreparo,
            RedirectAttributes redirectAttributes) throws Exception {

        Receita existente =
                repository.findById(id).orElse(null);

        if (existente == null) {
            return "redirect:/receitas-aprovadas";
        }

        existente.setTitulo(
                receita.getTitulo()
        );

        existente.setChefe(
                receita.getChefe()
        );

        existente.setTempoPreparo(
                receita.getTempoPreparo()
        );

        existente.setPorcoes(
                receita.getPorcoes()
        );

        existente.setCategoria(
                receita.getCategoria()
        );

        if (ingredientes != null) {

            existente.setIngredientes(
                    ingredientes.stream()
                            .map(String::trim)
                            .filter(s -> !s.isEmpty())
                            .reduce((a, b) -> a + "||" + b)
                            .orElse("")
            );
        }

        if (modoPreparo != null) {

            existente.setModoPreparo(
                    modoPreparo.stream()
                            .map(String::trim)
                            .filter(s -> !s.isEmpty())
                            .reduce((a, b) -> a + "||" + b)
                            .orElse("")
            );
        }

        if (imagemFile != null
                && !imagemFile.isEmpty()) {

            String uploadDir = "uploads/";

            Files.createDirectories(
                    Paths.get(uploadDir)
            );

            String filename =
                    System.currentTimeMillis()
                            + "_"
                            + imagemFile.getOriginalFilename();

            Files.write(
                    Paths.get(uploadDir, filename),
                    imagemFile.getBytes()
            );

            existente.setImagem(filename);
        }

        repository.save(existente);

        redirectAttributes.addFlashAttribute(
                "ok",
                "editada"
        );

        return "redirect:/receitas-aprovadas";
    }

    @PostMapping("/receitas-aprovadas/excluir/{id}")
    public String excluirReceitaAprovada(
            @PathVariable Long id) {

        Receita receita =
                repository.findById(id).orElse(null);

        if (receita != null
                && receita.getImagem() != null
                && !receita.getImagem().startsWith("http")) {

            try {

                Path imagePath =
                        Paths.get(
                                "uploads/"
                                        + receita.getImagem()
                        );

                Files.deleteIfExists(imagePath);

            } catch (IOException e) {

                System.err.println(
                        "Erro ao excluir imagem: "
                                + e.getMessage()
                );
            }
        }

        repository.deleteById(id);

        return "redirect:/receitas-aprovadas?ok=excluida";
    }

    @PostMapping("/aprovar/{id}")
    public String aprovarReceita(
            @PathVariable Long id) {

        Receita receita =
                repository.findById(id).orElse(null);

        if (receita != null) {

            receita.setStatus(
                    StatusReceita.APROVADA
            );

            repository.save(receita);

            Usuario autor =
                    receita.getUsuario();

            if (autor != null) {

                Notificacao notificacaoAutor =
                        new Notificacao(
                                autor,
                                "Sua receita \""
                                        + receita.getTitulo()
                                        + "\" foi aprovada pelo administrador.",
                                Notificacao.TipoNotificacao.RECEITA_APROVADA
                        );

                notificacaoRepository.save(
                        notificacaoAutor
                );
            }

            List<Usuario> usuarios =
                    usuarioRepository.findAll();

            for (Usuario usuario : usuarios) {

                if ("ADMIN".equals(usuario.getRole())) {
                    continue;
                }

                if (autor != null
                        && usuario.getId().equals(
                                autor.getId()
                        )) {
                    continue;
                }

                Notificacao notificacao =
                        new Notificacao(
                                usuario,
                                "Nova receita publicada: \""
                                        + receita.getTitulo()
                                        + "\".",
                                Notificacao.TipoNotificacao.NOVA_RECEITA
                        );

                notificacaoRepository.save(
                        notificacao
                );
            }
        }

        return "redirect:/pendentes?ok=aprovada";
    }

    @PostMapping("/rejeitar/{id}")
    public String rejeitarReceita(
            @PathVariable Long id,
            @RequestParam(required = false) String motivo) {

        Receita receita =
                repository.findById(id).orElse(null);

        if (receita != null) {

            receita.setStatus(
                    StatusReceita.REJEITADA
            );

            String motivoFinal =
                    motivo != null && !motivo.isBlank()
                            ? motivo
                            : "Sem motivo informado.";

            receita.setMotivoRejeicao(
                    motivoFinal
            );

            repository.save(receita);

            if (receita.getUsuario() != null) {

                Notificacao notificacao =
                        new Notificacao(
                                receita.getUsuario(),
                                "Sua receita \""
                                        + receita.getTitulo()
                                        + "\" foi rejeitada. Motivo: "
                                        + motivoFinal,
                                Notificacao.TipoNotificacao.RECEITA_REJEITADA
                        );

                notificacaoRepository.save(
                        notificacao
                );
            }
        }

        return "redirect:/pendentes?ok=rejeitada";
    }

    @GetMapping("/detalhe/{id}")
    public String detalheReceita(
            @PathVariable Long id,
            Model model) {

        model.addAttribute(
                "paginaAtual",
                "detalhe"
        );

        Receita receita =
                repository.findById(id).orElse(null);

        if (receita == null) {
            return "redirect:/";
        }

        List<String> ingredientesList =
                receita.getIngredientes() != null
                        ? Arrays.stream(
                                receita.getIngredientes()
                                        .split("\\|\\|")
                        )
                        .filter(s -> !s.isEmpty())
                        .toList()
                        : List.of();

        List<String> modoPreparoList =
                receita.getModoPreparo() != null
                        ? Arrays.stream(
                                receita.getModoPreparo()
                                        .split("\\|\\|")
                        )
                        .filter(s -> !s.isEmpty())
                        .toList()
                        : List.of();

        model.addAttribute(
                "receita",
                receita
        );

        model.addAttribute(
                "ingredientesList",
                ingredientesList
        );

        model.addAttribute(
                "modoPreparoList",
                modoPreparoList
        );

        String faviconUrl =
                siteConfigService.getFaviconUrl();

        model.addAttribute(
                "faviconUrl",
                faviconUrl
        );

        return "principal/receita/detalhes-receita";
    }

    @PostMapping("/receitas/excluir/{id}")
    @ResponseBody
    public ResponseEntity<?> excluirReceita(
            @PathVariable Long id) {

        try {

            if (!repository.existsById(id)) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(
                                Map.of(
                                        "message",
                                        "Receita não encontrada"
                                )
                        );
            }

            Receita receita =
                    repository.findById(id).orElse(null);

            if (receita != null
                    && receita.getImagem() != null
                    && !receita.getImagem().startsWith("http")) {

                try {

                    Path imagePath =
                            Paths.get(
                                    "uploads/"
                                            + receita.getImagem()
                            );

                    Files.deleteIfExists(imagePath);

                } catch (IOException e) {

                    System.err.println(
                            "Erro ao excluir imagem: "
                                    + e.getMessage()
                    );
                }
            }

            
                        if (receita != null && receita.getUsuario() != null) {
                        Notificacao notificacao =
                                new Notificacao(
                                        receita.getUsuario(),
                                        "Sua receita \"" + receita.getTitulo() + "\" foi excluída.",
                                        Notificacao.TipoNotificacao.RECEITA_EXCLUIDA
                                );

                        notificacaoRepository.save(notificacao);
                        }

                        repository.deleteById(id);
                return ResponseEntity.ok().body(
                        Map.of(
                                "message",
                                "Receita excluída com sucesso",
                                "id",
                                id
                        )
                );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            Map.of(
                                    "message",
                                    "Erro interno do servidor: "
                                            + e.getMessage()
                            )
                    );
        }
    }

    @GetMapping("/debug/carrossel")
    @ResponseBody
    public List<CarrosselItem> debugCarrossel() {

        List<CarrosselItem> itens =
                carrosselRepository
                        .findByAtivoTrueOrderByOrdemExibicaoAsc();

        System.out.println(
                "DEBUG - Itens do carrossel encontrados: "
                        + itens.size()
        );

        for (CarrosselItem item : itens) {

            System.out.println(
                    "Item: "
                            + item.getTitulo()
                            + " - URL: "
                            + item.getImagemUrl()
            );
        }

        return itens;
    }

    @GetMapping("/minhas-receitas")
    public String minhasReceitas(
            @RequestParam(
                    defaultValue = "pendentes"
            ) String aba,
            @RequestParam(
                    defaultValue = "0"
            ) int page,
            Model model) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication.getName().equals("anonymousUser")) {

            return "redirect:/";
        }

        String email =
                authentication.getName();

        Usuario usuario =
                usuarioRepository
                        .findByEmail(email)
                        .orElse(null);

        if (usuario == null) {
            return "redirect:/";
        }

        Pageable pageable =
                PageRequest.of(
                        page,
                        5,
                        Sort.by(
                                Sort.Direction.DESC,
                                "id"
                        )
                );

        Page<Receita> pendentesPage =
                repository.findByUsuarioIdAndStatus(
                        usuario.getId(),
                        StatusReceita.PENDENTE,
                        pageable
                );

        Page<Receita> aprovadasPage =
                repository.findByUsuarioIdAndStatus(
                        usuario.getId(),
                        StatusReceita.APROVADA,
                        pageable
                );

        Page<Receita> rejeitadasPage =
                repository.findByUsuarioIdAndStatus(
                        usuario.getId(),
                        StatusReceita.REJEITADA,
                        pageable
                );

        model.addAttribute(
                "paginaAtual",
                "minhas-receitas"
        );

        model.addAttribute(
                "nomeUsuario",
                usuario.getNome()
        );

        model.addAttribute(
                "abaAtiva",
                aba
        );

        model.addAttribute(
                "pendentes",
                pendentesPage.getContent()
        );

        model.addAttribute(
                "pendentesPage",
                pendentesPage.getNumber()
        );

        model.addAttribute(
                "pendentesTotalPages",
                pendentesPage.getTotalPages()
        );

        model.addAttribute(
                "pendentesTotal",
                pendentesPage.getTotalElements()
        );

        model.addAttribute(
                "aprovadas",
                aprovadasPage.getContent()
        );

        model.addAttribute(
                "aprovadasPage",
                aprovadasPage.getNumber()
        );

        model.addAttribute(
                "aprovadasTotalPages",
                aprovadasPage.getTotalPages()
        );

        model.addAttribute(
                "aprovadasTotal",
                aprovadasPage.getTotalElements()
        );

        model.addAttribute(
                "rejeitadas",
                rejeitadasPage.getContent()
        );

        model.addAttribute(
                "rejeitadasPage",
                rejeitadasPage.getNumber()
        );

        model.addAttribute(
                "rejeitadasTotalPages",
                rejeitadasPage.getTotalPages()
        );

        model.addAttribute(
                "rejeitadasTotal",
                rejeitadasPage.getTotalElements()
        );

        String faviconUrl =
                siteConfigService.getFaviconUrl();

        model.addAttribute(
                "faviconUrl",
                faviconUrl
        );

        return "principal/minhas-receitas";
    }

    @GetMapping("/minhas-receitas/{id}/detalhes")
    public String detalhesFragmentoCliente(
            @PathVariable Long id,
            Model model) {

        Receita receita =
                repository.findById(id).orElse(null);

        if (receita == null) {
            return "redirect:/minhas-receitas";
        }

        List<String> ingredientesList =
                receita.getIngredientes() != null
                        ? Arrays.stream(
                                receita.getIngredientes()
                                        .split("\\|\\|")
                        )
                        .filter(s -> !s.isEmpty())
                        .toList()
                        : List.of();

        List<String> modoPreparoList =
                receita.getModoPreparo() != null
                        ? Arrays.stream(
                                receita.getModoPreparo()
                                        .split("\\|\\|")
                        )
                        .filter(s -> !s.isEmpty())
                        .toList()
                        : List.of();

        model.addAttribute(
                "receita",
                receita
        );

        model.addAttribute(
                "ingredientesList",
                ingredientesList
        );

        model.addAttribute(
                "modoPreparoList",
                modoPreparoList
        );

        return "modais/visualizar-receita :: conteudo";
    }

    @GetMapping("/sobre")
    public String sobre(Model model) {

        model.addAttribute(
                "paginaAtual",
                "sobre"
        );

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication != null
                && authentication.isAuthenticated()
                && !authentication.getName().equals("anonymousUser")) {

            String email =
                    authentication.getName();

            Optional<Usuario> usuario =
                    usuarioRepository.findByEmail(email);

            if (usuario.isPresent()) {

                model.addAttribute(
                        "nomeUsuario",
                        usuario.get().getNome()
                );

            } else {

                model.addAttribute(
                        "nomeUsuario",
                        email
                );
            }
        }

        String faviconUrl =
                siteConfigService.getFaviconUrl();

        model.addAttribute(
                "faviconUrl",
                faviconUrl
        );

        return "principal/sobre";
    }
}

