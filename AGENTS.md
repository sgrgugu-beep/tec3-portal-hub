<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Public content reads use anonymous RLS-scoped server functions; administrative mutations use the signed-in client so section permissions remain authoritative.
- Gallery files use private Storage references (`storage:path`) and signed URLs resolved through publication-aware RLS, because workspace policy forbids public buckets.
- Gallery media remains in `fotos` with an explicit photo/video type; specialty editorial pages and opportunities are separate from curriculum management to preserve existing workflows.
- Feature colors belong to semantic CSS tokens and shared specialty identities, so public pages and management controls stay theme-compatible.
- Homepage photographic interactions are isolated in a browser-safe presentation component with CSS-based movement and reduced-motion/touch guards, so content loading and administrative workflows remain unchanged.
- Public inner pages share explicit photographic header identities and page-scoped editorial styles; keep their presentation separate from loaders, forms and permission logic to preserve existing workflows.
