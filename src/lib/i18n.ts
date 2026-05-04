// Traducciones para los 4 idiomas del sistema
// Castellano (es), Aymara (ay), Quechua (qu), Guaraní (gu)

export type Idioma = 'es' | 'ay' | 'qu' | 'gu';

export const IDIOMAS: { value: Idioma; label: string; bandera: string; nombreNativo: string }[] = [
  { value: 'es', label: 'Castellano', bandera: '🇧🇴', nombreNativo: 'Español' },
  { value: 'ay', label: 'Aymara', bandera: '🌄', nombreNativo: 'Aymara' },
  { value: 'qu', label: 'Quechua', bandera: '🌻', nombreNativo: "Qhichwa Simi" },
  { value: 'gu', label: 'Guaraní', bandera: '🦜', nombreNativo: "Avañe'ẽ" },
];

const translations = {
  es: {
    // General
    app_name: 'AVA / EVA Comunitario',
    bienvenido: 'Bienvenido',
    salir: 'Salir',
    guardar: 'Guardar',
    enviar: 'Enviar',
    cancelar: 'Cancelar',
    cargando: 'Cargando...',
    error: 'Ocurrió un error',
    exito: '¡Guardado con éxito!',
    bloqueado: 'Bloqueado',

    // Login
    login_titulo: '¡Hola! ¿Cómo te llamas?',
    login_usuario: 'Tu nombre de usuario',
    login_pin: 'Tu código PIN (4 números)',
    login_boton: 'Entrar',
    login_error: 'Usuario o PIN incorrecto',
    login_pedir_ayuda: 'Pide ayuda a tu maestra',

    // Idioma
    idioma_titulo: '¿En qué idioma quieres aprender?',
    idioma_subtitulo: 'Puedes cambiarlo después',
    idioma_continuar: 'Continuar',

    // Mapa
    mapa_titulo: 'Tu camino de aprendizaje',
    mapa_subtitulo: 'Completa cada parada para avanzar',
    mapa_completado: '¡Completado! ✓',
    mapa_disponible: 'Toca para entrar',
    mapa_bloqueado: 'Completa el anterior primero',
    mapa_progreso: 'Tu progreso',

    // Momentos
    momento_practica: 'Práctica',
    momento_teoria: 'Teoría',
    momento_valoracion: 'Valoración',
    momento_produccion: 'Producción',

    // Práctica
    practica_instruccion: 'Sube una foto o audio desde tu realidad',
    practica_subir_foto: 'Subir foto',
    practica_subir_audio: 'Grabar o subir audio',
    practica_texto: 'O escribe tu respuesta aquí',
    practica_completar: 'Completar Práctica',

    // Teoría
    teoria_instruccion: 'Mira el video y lee la infografía',
    teoria_completar: 'Ya lo entendí, continuar',

    // Valoración
    valoracion_pregunta: 'Reflexionemos juntos',
    valoracion_placeholder: 'Escribe tu opinión aquí...',
    valoracion_comentarios: 'Lo que dicen tus compañeros',
    valoracion_completar: 'Compartí mi opinión',

    // Producción
    produccion_instruccion: 'Crea y sube tu producto final',
    produccion_reflexion: 'Cuéntanos qué aprendiste',
    produccion_completar: 'Subir mi proyecto',

    // Evaluación
    eval_titulo: '¿Cómo te fue?',
    eval_logrado: '¡Lo logré! 🌟',
    eval_proceso: 'Estoy en camino 🌱',
    eval_ayuda: 'Necesito ayuda 🤝',

    // Coevaluación
    coeval_titulo: 'Trabajos de tus compañeros',
    coeval_estrella1: '⭐ Primera estrella (algo bueno)',
    coeval_estrella2: '⭐ Segunda estrella (algo muy bueno)',
    coeval_deseo: '🌠 Mi deseo (cómo mejorar)',

    // Tutoría
    tutoria_titulo: 'Mi Padrino/Madrina Digital',
    tutoria_pedir_ayuda: 'Pedir ayuda a mi Padrino/Madrina',
    tutoria_sin_padrino: 'Aún no tienes padrino asignado',
    tutoria_mensaje_placeholder: 'Escribe tu pregunta...',
    tutoria_mensajes_nuevos: 'Mensajes nuevos',

    // Maestro
    maestro_titulo: 'Panel del Maestro',
    maestro_estudiantes: 'Mis Estudiantes',
    maestro_padrinos: 'Padrinos Digitales',
    maestro_portafolios: 'Portafolios',
    maestro_nuevo_usuario: 'Agregar estudiante',

    // Evaluación familiar
    familia_titulo: 'Evaluación Familiar',
    familia_confirmar: '¿Tu hijo/a aplicó lo aprendido en casa?',
    familia_subir_audio: 'Subir audio contando cómo lo usó',
    familia_comentario: 'O escribe un comentario',
    familia_enviar: 'Enviar evaluación',

    // Maestro Ext
    maestro_seguimiento: 'Seguimiento Académico',
    maestro_revisar: 'Revisar Tareas',
    maestro_pendientes: 'Por Revisar',
    maestro_revisados: 'Revisados',
    maestro_necesita_ayuda: 'Necesita Ayuda',
    maestro_en_proceso: 'En Proceso',
    maestro_logrado: 'Logrado',

    // Student Ext
    estudiante_mis_entregas: 'Mis Trabajos y Comentarios',
    estudiante_comentario_maestra: 'Respuesta de tu Maestra',
    estudiante_nota_padrino: 'Nota de tu Padrino Digital',
    estudiante_ver_archivo: 'Ver mi archivo',
    estudiante_recursos_apoyo: 'Recursos de Apoyo',
    estudiante_turno_crear: '¡Tu turno de crear!',
    estudiante_subir_foto: 'Subir Foto',
    estudiante_subir_audio: 'Subir Audio',
    estudiante_escribe_aqui: 'Escribe aquí tu respuesta...',
    estudiante_tema_actual: 'TEMA ACTUAL',

    // Familia Ext
    familia_portal: 'Portal Familiar',
    familia_viendo_progreso: 'Viendo el progreso de',
    familia_evaluar_logros: 'Evaluar Logros',
    familia_progreso_hijo: 'Progreso de tu hijo/a',

    // Idioma Ext
    idioma_pregunta: '¿Cómo quieres aprender?',
    idioma_descripcion: 'Elige el idioma que más te guste para tu aventura.',
    idioma_empezar: '¡Empezar Ahora!',
    // Maestro Tabs
    maestro_tab_alumnos: 'Mis Alumnos',
    maestro_tab_seguimiento: 'Seguimiento',
    maestro_tab_revisar: 'Revisar Tareas',
    maestro_tab_muro: 'Muro de Reflexión',
    maestro_tab_config: 'Configurar Temas',
    maestro_tab_nuevo: 'Registrar Usuario',
    maestro_panel: 'Panel del Maestro',
    maestro_bienvenida: '¡Bienvenida de nuevo',
  },

  ay: {
    app_name: 'AVA / EVA Comunal',
    bienvenido: 'Yäpxatam',
    salir: 'Mistuñani',
    guardar: 'Uñt\'ayañani',
    enviar: 'Apxatañani',
    cancelar: 'Sartañani',
    cargando: 'Nayraqataw...',
    error: 'Janiwa mayacht\'añakiti',
    exito: '¡Yäpxatasmawa!',
    bloqueado: 'Janiwa kuna lurañakiti',

    login_titulo: '¡Kunjamaskta! Sutimasti?',
    login_usuario: 'Sutima',
    login_pin: 'PIN yatiña (4 yati)',
    login_boton: 'Mantam',
    login_error: 'Janiwa sutima yatiñakiti',
    login_pedir_ayuda: 'Maestrakiru yanapaña munta',

    idioma_titulo: 'Kunapach arunakaw yatintañataki?',
    idioma_subtitulo: 'Jutïr marani aruruw waljañäpan',
    idioma_continuar: 'Nayraqataru',

    mapa_titulo: 'Yatiqañan nayra',
    mapa_subtitulo: 'Sata ukhamawa nayraqataru sarantam',
    mapa_completado: '¡Tukuyataxa! ✓',
    mapa_disponible: 'Mantañataki tukam',
    mapa_bloqueado: 'Nayrïrïwa tukuyam',
    mapa_progreso: 'Kunjamasa sarantaxa',

    momento_practica: 'Luratawi',
    momento_teoria: 'Yatxatawi',
    momento_valoracion: 'Amtawi',
    momento_produccion: 'Lurawi',

    practica_instruccion: 'Uma foto utjasipana uñstayam',
    practica_subir_foto: 'Foto apxatam',
    practica_subir_audio: 'Audio apxatam',
    practica_texto: 'Uka janïrkiw ukhama qilqam',
    practica_completar: 'Luratawi tukuyam',

    teoria_instruccion: 'Video uñjam ukhamaraki infografia lïyam',
    teoria_completar: 'Yatiqataxa, nayraqataru',

    valoracion_pregunta: 'Arsuñataki',
    valoracion_placeholder: 'Amtawipata qilqam...',
    valoracion_comentarios: 'Masïnakana arsuwinakapa',
    valoracion_completar: 'Arsuwixa apxatataxa',

    produccion_instruccion: 'Lurataparuw apxatam',
    produccion_reflexion: 'Kunatï yatiqataxa',
    produccion_completar: 'Lurawixa apxatam',

    eval_titulo: 'Kunjamasa lurataxa?',
    eval_logrado: '¡Lurxataxa! 🌟',
    eval_proceso: 'Nayraqataw sarantaxa 🌱',
    eval_ayuda: 'Yanapaña muntha 🤝',

    coeval_titulo: 'Masïnakana luratapaxa',
    coeval_estrella1: '⭐ Nayrïr achachila (suma wali)',
    coeval_estrella2: '⭐ Payïr achachila (askinaka)',
    coeval_deseo: '🌠 Muna (kunayman yapxatatäni)',

    tutoria_titulo: 'Nayrïr Padrino/Madrinaja',
    tutoria_pedir_ayuda: 'Padrinojaruwa yanapaña munta',
    tutoria_sin_padrino: 'Janiw Padrinojaxa utjkiti',
    tutoria_mensaje_placeholder: 'Tapuwiparuw qilqam...',
    tutoria_mensajes_nuevos: 'Yatiyatanaka jutanï',

    maestro_titulo: 'Yatichirin Panel',
    maestro_estudiantes: 'Yatiqirinakaja',
    maestro_padrinos: 'Padrinos Digitales',
    maestro_portafolios: 'Portafolios',
    maestro_nuevo_usuario: 'Yatiqiri ch\'iqt\'am',

    familia_titulo: 'Familian amtawi',
    familia_confirmar: '¿Wawarijaxa utanx luratacha?',
    familia_subir_audio: 'Audio apxatam',
    familia_comentario: 'Uka janïrkiw qilqam',
    familia_enviar: 'Apxatam',

    offline_aviso: 'Janiw conectarakiti - offline lurataxa',
    offline_sync: 'Sincronizando...',
    offline_sync_ok: 'Tukuy sincronizataxa ✓',
  },

  qu: {
    app_name: 'AVA / EVA Llaqtakunamanta',
    bienvenido: 'Allinllachu',
    salir: 'Lluksiyta',
    guardar: 'Waqaychay',
    enviar: 'Apachiy',
    cancelar: 'Saqiy',
    cargando: 'Ñawpaqman...',
    error: 'Pantaykuwarqa',
    exito: '¡Waqaychataña!',
    bloqueado: 'Wisq\'asqa',

    login_titulo: '¡Imaynalla! Sutiyki?',
    login_usuario: 'Sutiyki',
    login_pin: 'PIN yachay (4 yupay)',
    login_boton: 'Yaykuy',
    login_error: 'Suti mana allinchu',
    login_pedir_ayuda: 'Maestrataqa yanapachiy',

    idioma_titulo: 'Ima rimaypitaq yachankichik?',
    idioma_subtitulo: 'Qhipaman t\'ikranayta atinki',
    idioma_continuar: 'Ñawpaqman',

    mapa_titulo: 'Yachay ñan',
    mapa_subtitulo: 'Sapa paradasta hunt\'ashpa ñawpaqman ri',
    mapa_completado: '¡Hunt\'asqa! ✓',
    mapa_disponible: 'Yaykuyta tukay',
    mapa_bloqueado: 'Ñawpaqta hunt\'ay',
    mapa_progreso: 'Imaynatan purishanki',

    momento_practica: 'Llamkay',
    momento_teoria: 'Yachay',
    momento_valoracion: 'Yuyay',
    momento_produccion: 'Ruraq',

    practica_instruccion: 'Foto utaq audio wicharichiy',
    practica_subir_foto: 'Foto apay',
    practica_subir_audio: 'Audio apay',
    practica_texto: 'Utaqpis kaypi qillqay',
    practica_completar: 'Llamkayta hunt\'ay',

    teoria_instruccion: 'Video qhaway ukhamis infografia liyay',
    teoria_completar: 'Yacharqanim, ñawpaqman',

    valoracion_pregunta: 'Huñunakusun',
    valoracion_placeholder: 'Yuyayniykita qillqay...',
    valoracion_comentarios: 'Masinkuna rimashqanku',
    valoracion_completar: 'Yuyayniyta apachirqani',

    produccion_instruccion: 'Rurasqaykita wicharichiy',
    produccion_reflexion: 'Imatá yachakunki nispa willaway',
    produccion_completar: 'Proyectota apay',

    eval_titulo: 'Imaynata karqanki?',
    eval_logrado: '¡Ruwani! 🌟',
    eval_proceso: 'Ñawpaqman richkani 🌱',
    eval_ayuda: 'Yanapakuyta munaní 🤝',

    coeval_titulo: 'Masinkuna rurasqanku',
    coeval_estrella1: '⭐ Ñawpaq ch\'askacha (allin)',
    coeval_estrella2: '⭐ Iskay ch\'askacha (ancha allin)',
    coeval_deseo: '🌠 Munayman (imaynatan aswan allin kanman)',

    tutoria_titulo: 'Padrino/Madrinay',
    tutoria_pedir_ayuda: 'Padrinoyta yanapachiy',
    tutoria_sin_padrino: 'Manaraqmi padrinoy tiyanchu',
    tutoria_mensaje_placeholder: 'Tapukuyta qillqay...',
    tutoria_mensajes_nuevos: 'Willakuykuna ñawpaq',

    maestro_titulo: 'Maestro Panel',
    maestro_estudiantes: 'Yachaqakuqkuna',
    maestro_padrinos: 'Padrinos Digitales',
    maestro_portafolios: 'Portafolios',
    maestro_nuevo_usuario: 'Yachaqakunata yapay',

    familia_titulo: 'Familiamanta kallpachay',
    familia_confirmar: '¿Wawaykin wasipi llamkarqachu?',
    familia_subir_audio: 'Audio apay',
    familia_comentario: 'Utaqpis qillqay',
    familia_enviar: 'Apachiy',

    offline_aviso: 'Mana conectasqachu - offline llamkashkani',
    offline_sync: 'Tinkiykachkani...',
    offline_sync_ok: 'Tukuy tinkisqa ✓',
  },

  gu: {
    app_name: 'AVA / EVA Ñembyasy',
    bienvenido: 'Bienvenido',
    salir: 'Sẽso',
    guardar: 'Ñongatu',
    enviar: 'Mondo',
    cancelar: 'Heja',
    cargando: 'Oñemohenda...',
    error: 'Ojejapo oje\'a',
    exito: '¡Oñongatuva\'ekue!',
    bloqueado: 'Ñepysẽ',

    login_titulo: '¡Mba\'éichapa! Mba\'e ndérera?',
    login_usuario: 'Nde rérape',
    login_pin: 'PIN ñe\'ẽ (4 papaha)',
    login_boton: 'Mojumi',
    login_error: 'Ndaipóri nde réra',
    login_pedir_ayuda: 'Embohasa maestra ndéve',

    idioma_titulo: 'Mba\'e ñe\'ẽme reaprendesépa?',
    idioma_subtitulo: 'Eikuaa añónte ejapo térã',
    idioma_continuar: 'Ñepyrũ',

    mapa_titulo: 'Nde rape aprendizaje',
    mapa_subtitulo: 'Eheja oîkuaatéva ñepyrũ oîkóvo',
    mapa_completado: '¡Opyta! ✓',
    mapa_disponible: 'Eñepyrũ',
    mapa_bloqueado: 'Eheja oñembohasa ñepyrũ',
    mapa_progreso: 'Mba\'éichapa reñembo\'e',

    momento_practica: 'Ñepyrũ',
    momento_teoria: 'Ñemoarandu',
    momento_valoracion: 'Ñemoĩporã',
    momento_produccion: 'Ñembosako\'i',

    practica_instruccion: 'Mondo foto térã audio',
    practica_subir_foto: 'Mondo foto',
    practica_subir_audio: 'Mondo audio',
    practica_texto: 'Térã emoĩ ñe\'ẽ kape',
    practica_completar: 'Ñepyrũ opyta',

    teoria_instruccion: 'Ehecha video ha emolee infografia',
    teoria_completar: 'Aikuaáma, ñepyrũ',

    valoracion_pregunta: 'Roñomongeta',
    valoracion_placeholder: 'Ehai nde rembiapo...',
    valoracion_comentarios: 'Ro\'a rembiapo',
    valoracion_completar: 'Amondo ña rembiapo',

    produccion_instruccion: 'Mondo nde rembiapo',
    produccion_reflexion: 'Mba\'e reikuaa hague emombe\'u',
    produccion_completar: 'Mondo nde proyecto',

    eval_titulo: 'Mba\'éichapa oiko?',
    eval_logrado: '¡Jajapo! 🌟',
    eval_proceso: 'Rohasa ñande mba\'e 🌱',
    eval_ayuda: 'Eipytyvõ che 🤝',

    coeval_titulo: 'Ro\'a rembiapo',
    coeval_estrella1: '⭐ Peteĩ mbyja (iporã)',
    coeval_estrella2: '⭐ Mokõi mbyja (hetaiterei iporã)',
    coeval_deseo: '🌠 Mandu\'a (mba\'éicha avanhápe)',

    tutoria_titulo: 'Che Padrino/Madrina',
    tutoria_pedir_ayuda: 'Eheko pytyvõ Padrinomendive',
    tutoria_sin_padrino: 'Nda\'ipóri Padrino',
    tutoria_mensaje_placeholder: 'Emoĩ tapykuépe...',
    tutoria_mensajes_nuevos: 'Ñe\'ẽ pyahu',

    maestro_titulo: 'Mbo\'ehára Panel',
    maestro_estudiantes: 'Che ra\'y/memby',
    maestro_padrinos: 'Padrinos Digitales',
    maestro_portafolios: 'Portafolios',
    maestro_nuevo_usuario: 'Embojuaju mbo\'ekuaa pyahu',

    familia_titulo: 'Téta mba\'eporu',
    familia_confirmar: '¿Nde ra\'y/membyrekópa ojapo ogápe?',
    familia_subir_audio: 'Mondo audio',
    familia_comentario: 'Térã ehai',
    familia_enviar: 'Mondo',

    offline_aviso: 'Ndaicói internet - offline',
    offline_sync: 'Oñepyrũ sincronización...',
    offline_sync_ok: 'Oñembosako\'i ✓',
  },
} as const;

export type TranslationKeys = keyof typeof translations.es;

export function t(idioma: Idioma, key: TranslationKeys): string {
  const lang = translations[idioma] ?? translations.es;
  return (lang as Record<string, string>)[key] ?? (translations.es as Record<string, string>)[key] ?? key;
}

export default translations;
