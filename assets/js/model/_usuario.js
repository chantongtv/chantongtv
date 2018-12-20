/*
|--------------------------------------------------------------------------
| Model Usuario
|--------------------------------------------------------------------------
*/

APP.model.Usuario = {

    FotoPerfilAux : {},
    NmCompleto : "",
    FlSexo : "",
    CdIdentificacao : "",
    NuCPF : "",
    DtExpiracao : "",
    IdPerfil : "",
    FlRecebeEmail : "",
    FlCompartilhado : "",
    FlAtivo : "",
    FlBloqueado : "",
    UsuarioClienteSites : {},
    IdUsuario : "",
    UsuarioCargoes : {},

    constructor : function (_FotoPerfilAux, _NmCompleto, _FlSexo, _CdIdentificacao, _NuCPF, _DtExpiracao, _IdPerfil, _FlRecebeEmail,
                            _FlCompartilhado, _FlAtivo, _FlBloqueado, _UsuarioClienteSites, _IdUsuario, _UsuarioCargoes)
    {
        var usuario = {
            FotoPerfilAux : _FotoPerfilAux,
            NmCompleto : _NmCompleto,
            FlSexo : _FlSexo,
            CdIdentificacao : _CdIdentificacao,
            NuCPF : _NuCPF,
            DtExpiracao : _DtExpiracao,
            IdPerfil :_IdPerfil,
            FlRecebeEmail : _FlRecebeEmail,
            FlCompartilhado : _FlCompartilhado,
            FlAtivo : _FlAtivo,
            FlBloqueado : _FlBloqueado,
            UsuarioClienteSites : _UsuarioClienteSites,
            IdUsuario : _IdUsuario,
            UsuarioCargoes :_UsuarioCargoes,
        };
        return usuario;
    }

};
