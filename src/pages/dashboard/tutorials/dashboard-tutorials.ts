import type {
	ITutorialControl,
	ITutorialGroup,
	ITutorialSection,
} from './models/dashboard-tutorial.interface';

/**
 * Three patterns repeat across almost every list of the dashboard: the
 * "Mostrar inactivos" filter, the per-row activation switch and the pencil that
 * opens the edit modal. They are generated per entity so every chapter stays
 * self-contained without the file repeating the same paragraph nine times.
 */
const showInactiveControl = (plural: string): ITutorialControl => ({
	label: 'Mostrar inactivos',
	kind: 'toggle',
	location: 'Interruptor arriba a la derecha de la tabla',
	what: `Vuelve a traer a la tabla ${plural} desactivados, que por defecto quedan ocultos.`,
	steps: [
		'Hacé clic en el interruptor para encenderlo.',
		`La tabla se recarga e incluye ${plural} activos e inactivos; las filas inactivas se ven atenuadas.`,
		'Volvé a hacer clic para apagarlo y ver solamente los activos.',
	],
	tip: 'Es el único camino para reactivar algo que desactivaste: primero mostralo, después usá su interruptor de estado.',
});

const activeSwitchControl = (
	singular: string,
	article: 'el' | 'la'
): ITutorialControl => ({
	label: 'Interruptor de estado (columna Activo / Estado)',
	kind: 'toggle',
	location: 'Dentro de cada fila de la tabla',
	what: `Activa o desactiva ${article} ${singular} sin borrarlo. Los registros inactivos dejan de mostrarse en la tienda pero conservan su historial.`,
	steps: [
		'Ubicá la fila que querés cambiar.',
		'Hacé clic en el interruptor de la columna de estado.',
		'El interruptor queda deshabilitado mientras se guarda y luego aparece un aviso de confirmación.',
	],
	warning:
		'La baja es lógica, no física: nada se elimina. Si te equivocaste, encendé "Mostrar inactivos" y volvé a activarlo.',
});

const editPencilControl = (
	singular: string,
	article: 'el' | 'la'
): ITutorialControl => ({
	label: 'Lápiz (columna Acciones)',
	kind: 'secondary',
	location: 'Última columna de cada fila',
	what: `Abre el formulario de modificación de ${article} ${singular} con los datos actuales ya cargados.`,
	steps: [
		'Hacé clic en el lápiz de la fila.',
		'Editá los campos que necesites en la ventana que se abre.',
		'Confirmá con "Guardar cambios" o descartá con "Cancelar".',
	],
});

const modalFooterGroup = (
	singular: string,
	saveLabel = 'Guardar cambios'
): ITutorialGroup => ({
	title: `Ventana de modificación de ${singular}`,
	controls: [
		{
			label: saveLabel,
			kind: 'primary',
			location: 'Abajo a la derecha de la ventana',
			what: 'Envía los cambios y cierra la ventana. La tabla se recarga sola con los datos nuevos.',
			steps: [
				'Revisá que no haya mensajes en rojo debajo de los campos.',
				'Hacé clic en el botón; se muestra un spinner mientras se guarda.',
				'Al terminar aparece el aviso de éxito y la ventana se cierra.',
			],
			tip: 'El botón permanece deshabilitado mientras falte un campo obligatorio o haya un error de validación.',
		},
		{
			label: 'Cancelar',
			kind: 'secondary',
			location: 'Abajo a la izquierda de la ventana',
			what: 'Cierra la ventana sin guardar nada.',
			steps: [
				'Hacé clic en "Cancelar" (o en la X de la esquina superior derecha).',
				'Los cambios que escribiste se descartan.',
			],
		},
	],
});

const catalogTabsControl = (action: string): ITutorialControl => ({
	label: 'Categorías · Sub-Categorías · Marcas · Emociones · Colores · Esencias · Tipos de Vivienda · Métodos de Pago',
	kind: 'navigation',
	location: 'Fila de botones sobre el contenido',
	what: `Cada botón cambia el catálogo con el que estás trabajando. El botón activo queda pintado en rosa. ${action}`,
	steps: [
		'Hacé clic en el catálogo que quieras trabajar.',
		'El contenido de abajo se reemplaza por el de ese catálogo.',
	],
	tip: 'Las sub-categorías se cargan dentro de una categoría, así que conviene crearlas antes de armar la categoría que las agrupa.',
});

export const dashboardTutorials: ITutorialSection[] = [
	{
		id: 'sidebar',
		title: 'Navegación general',
		summary:
			'Cómo moverte por el panel: el menú lateral, los grupos plegables y la barra superior que sigue disponible dentro del dashboard.',
		groups: [
			{
				title: 'Menú lateral',
				controls: [
					{
						label: 'Inicio',
						kind: 'navigation',
						location: 'Primer botón del menú lateral',
						what: 'Abre el tablero de métricas. Es la única entrada del menú que no se despliega: lleva directo a la pantalla.',
						steps: [
							'Hacé clic en "Inicio".',
							'El botón queda resaltado y el panel derecho muestra las métricas.',
						],
					},
					{
						label: 'Productos · Catálogos · Usuarios · Pedidos · Punto de Venta · Reseñas',
						kind: 'navigation',
						location: 'Menú lateral',
						what: 'Son grupos plegables. Al hacer clic se despliegan y muestran las pantallas que contienen.',
						steps: [
							'Hacé clic en el nombre del grupo para desplegarlo.',
							'Elegí una de las pantallas de la lista que aparece debajo.',
							'Volvé a hacer clic en el nombre del grupo para plegarlo.',
						],
						tip: 'Solo un grupo queda abierto a la vez: al abrir otro, el anterior se cierra.',
					},
					{
						label: 'Sub-entradas (Lista de Productos, Crear Producto, Roles, …)',
						kind: 'navigation',
						location: 'Dentro de cada grupo desplegado',
						what: 'Cargan la pantalla correspondiente en el panel derecho. La que está en uso se muestra con fondo gris.',
						steps: [
							'Desplegá el grupo.',
							'Hacé clic en la sub-entrada.',
							'El panel derecho se reemplaza sin recargar la página.',
						],
						warning:
							'Cambiar de pantalla descarta lo que hayas escrito en un formulario sin guardar.',
					},
				],
			},
			{
				title: 'Barra superior',
				controls: [
					{
						label: 'Barra de navegación del sitio',
						kind: 'navigation',
						location: 'Arriba de todo, sobre el panel',
						what: 'Es la misma barra de la tienda: te permite volver al sitio público, buscar productos, entrar al carrito o al perfil sin salir del dashboard.',
						steps: [
							'Usá el logo para volver a la tienda.',
							'Usá el perfil para cerrar sesión.',
						],
					},
					{
						label: 'Ayuda (?)',
						kind: 'secondary',
						location: 'Junto al título "Dashboard", arriba del menú lateral',
						what: 'Abre esta guía. Se abre siempre en el capítulo de la pantalla que estás viendo.',
						steps: [
							'Hacé clic en el botón "?".',
							'Elegí un capítulo en la lista izquierda o usá el buscador para encontrar un botón por nombre.',
							'Cerrá con la X o haciendo clic fuera de la ventana.',
						],
					},
				],
			},
		],
	},
	{
		id: 'home',
		title: 'Inicio · Métricas',
		summary:
			'El tablero de analítica. Todos sus botones son de navegación entre vistas: ninguno modifica datos, así que podés explorarlos sin riesgo.',
		groups: [
			{
				title: 'Vistas del tablero',
				controls: [
					{
						label: 'Resumen',
						kind: 'navigation',
						location: 'Barra de botones superior',
						what: 'Vista inicial: ingresos, ingresos cobrados, órdenes, órdenes pagadas, productos y usuarios, más el gráfico de ventas en el tiempo y los productos más vistos.',
						steps: [
							'Hacé clic en "Resumen".',
							'Leé el rango de fechas que figura arriba de las tarjetas para saber a qué período corresponden los números.',
						],
					},
					{
						label: 'Canales',
						kind: 'navigation',
						location: 'Barra de botones superior',
						what: 'Desglosa las ventas por canal (tienda online y punto de venta) y por método de pago.',
						steps: ['Hacé clic en "Canales".'],
						tip: 'Es la vista para comparar cuánto pesa el mostrador frente a la web.',
					},
					{
						label: 'Inventario',
						kind: 'navigation',
						location: 'Barra de botones superior',
						what: 'Muestra el estado del stock: productos sin stock, con stock bajo y los más vendidos.',
						steps: ['Hacé clic en "Inventario".'],
						tip: 'Usala antes de reponer: te dice qué reponer primero sin recorrer la lista de productos.',
					},
					{
						label: 'Clientes',
						kind: 'navigation',
						location: 'Barra de botones superior',
						what: 'Métricas de clientes: nuevos, recurrentes y los que más compraron.',
						steps: ['Hacé clic en "Clientes".'],
					},
					{
						label: 'Conversión',
						kind: 'navigation',
						location: 'Barra de botones superior',
						what: 'Relaciona visitas, carritos y compras para mostrar dónde se pierden las ventas.',
						steps: ['Hacé clic en "Conversión".'],
					},
				],
			},
			{
				title: 'Gráfico "Ventas en el tiempo" (dentro de Resumen)',
				controls: [
					{
						label: 'Día / Semana / Mes',
						kind: 'navigation',
						location: 'Esquina superior derecha de la tarjeta del gráfico',
						what: 'Cambia la agrupación de la serie de ventas. El botón activo queda pintado en rosa.',
						steps: [
							'Hacé clic en la agrupación que quieras.',
							'El gráfico se vuelve a pedir al servidor y se redibuja.',
						],
						tip: '"Día" sirve para ver el efecto de una promoción puntual; "Mes" para ver la tendencia sin el ruido diario.',
					},
				],
			},
		],
	},
	{
		id: 'product-list',
		title: 'Productos · Lista de Productos',
		summary:
			'La tabla con todo el catálogo de productos. Desde acá se editan, se activan y se dan de baja.',
		groups: [
			{
				title: 'Encabezado',
				controls: [
					{
						label: 'Productos',
						kind: 'navigation',
						location: 'Botón centrado sobre la tabla',
						what: 'Selecciona la vista de la pantalla. Hoy es la única disponible, así que queda siempre activa.',
						steps: ['No requiere acción: ya está seleccionada al entrar.'],
					},
					showInactiveControl('los productos'),
				],
			},
			{
				title: 'Acciones sobre cada fila',
				controls: [
					{
						label: 'Nombre del producto (texto subrayado)',
						kind: 'secondary',
						location: 'Primera columna',
						what: 'No es un botón: al pasar el mouse por encima muestra la descripción completa del producto en un globo.',
						steps: [
							'Llevá el cursor sobre el nombre subrayado con línea de puntos.',
							'Leé la descripción en el globo que aparece.',
						],
						tip: 'Si dice "Sin descripción", el producto está publicado sin texto: conviene completarlo desde el lápiz.',
					},
					activeSwitchControl('producto', 'el'),
					editPencilControl('producto', 'el'),
				],
			},
			modalFooterGroup('producto', 'Guardar Cambios'),
		],
	},
	{
		id: 'create-product',
		title: 'Productos · Crear Producto',
		summary:
			'El formulario de alta. Tiene la secuencia de botones más larga del panel porque incluye la carga y el recorte de imágenes.',
		groups: [
			{
				title: 'Formulario',
				controls: [
					{
						label: 'Productos',
						kind: 'navigation',
						location: 'Botón centrado en la parte superior',
						what: 'Selecciona qué se está creando. Hoy es la única opción.',
						steps: ['No requiere acción.'],
					},
					{
						label: 'Crear Producto',
						kind: 'primary',
						location: 'Abajo del formulario, centrado',
						what: 'Sube las imágenes recortadas y da de alta el producto.',
						steps: [
							'Completá al menos nombre, precio y categoría: sin esos tres el botón queda deshabilitado.',
							'Hacé clic en "Crear Producto"; pasa a decir "Creando..." con un spinner.',
							'Al terminar, el formulario se vacía y queda listo para el siguiente producto.',
						],
						warning:
							'Si algún campo tiene error, el botón no envía nada: aparece un aviso y se marcan en rojo los campos a corregir.',
					},
				],
			},
			{
				title: 'Carga de imágenes',
				controls: [
					{
						label: 'Cargar imágenes',
						kind: 'secondary',
						location: 'Sobre el botón de crear',
						what: 'Despliega la zona para arrastrar o elegir archivos.',
						steps: [
							'Escribí primero el nombre del producto: sin nombre la zona de carga no se habilita y avisa en rojo.',
							'Hacé clic en "Cargar imágenes".',
							'Arrastrá los archivos a la zona punteada o hacé clic en ella para abrir el explorador.',
						],
						tip: 'Se aceptan varias imágenes a la vez, en proporción 16:9 y hasta 10 MB cada una.',
					},
					{
						label: 'Cancelar Carga',
						kind: 'secondary',
						location: 'Dentro de la zona de carga, abajo',
						what: 'Vacía la selección completa de imágenes y cierra la zona de carga.',
						steps: ['Hacé clic en "Cancelar Carga".'],
						warning:
							'Borra todas las imágenes ya recortadas, no solo la última. Para quitar una sola usá la X de su miniatura.',
					},
					{
						label: 'X sobre la miniatura',
						kind: 'destructive',
						location: 'Esquina superior derecha de cada imagen en "Vista previa"',
						what: 'Quita esa única imagen de la selección.',
						steps: [
							'Pasá el mouse sobre la miniatura hasta que aparezca la X roja.',
							'Hacé clic en la X.',
						],
					},
				],
			},
			{
				title: 'Aviso "Archivo(s) demasiado grande(s)"',
				controls: [
					{
						label: 'Redimensionar',
						kind: 'primary',
						location: 'Ventana que aparece si un archivo supera 10 MB',
						what: 'Comprime automáticamente los archivos pesados y los manda al recortador.',
						steps: [
							'Revisá en la lista qué archivos se van a redimensionar.',
							'Hacé clic en "Redimensionar".',
							'Los que sigan pasando el límite se descartan con un aviso.',
						],
					},
					{
						label: 'Cancelar',
						kind: 'secondary',
						location: 'Misma ventana',
						what: 'Descarta los archivos pesados y cierra el aviso. Los archivos que sí entraban en el límite siguen su curso.',
						steps: ['Hacé clic en "Cancelar".'],
					},
				],
			},
			{
				title: 'Recortador de imágenes',
				controls: [
					{
						label: 'Barra de zoom',
						kind: 'secondary',
						location: 'Debajo de la imagen',
						what: 'Acerca o aleja la imagen dentro del marco 16:9. El porcentaje se muestra a la derecha.',
						steps: [
							'Arrastrá la barra para ajustar el zoom entre 100% y 300%.',
							'Arrastrá la imagen con el mouse para elegir qué queda dentro del marco.',
						],
					},
					{
						label: 'Flecha circular (reiniciar zoom)',
						kind: 'secondary',
						location: 'A la derecha del porcentaje de zoom',
						what: 'Devuelve el zoom al 100%.',
						steps: ['Hacé clic en el ícono de flecha circular.'],
					},
					{
						label: 'Siguiente / Finalizar y Aceptar',
						kind: 'primary',
						location: 'Debajo de la barra de zoom, centrado',
						what: 'Confirma el recorte actual. Dice "Siguiente" mientras queden imágenes por recortar y "Finalizar y Aceptar" en la última.',
						steps: [
							'Encuadrá la imagen.',
							'Hacé clic en el botón; el contador "Imagen X de Y" avanza.',
							'Al aceptar la última, todos los recortes pasan a la vista previa del formulario.',
						],
						tip: 'Las imágenes recién se suben al servidor cuando presionás "Crear Producto", no al recortarlas.',
					},
					{
						label: 'Cancelar / Cancelar todo',
						kind: 'secondary',
						location: 'Al lado del botón de confirmar',
						what: 'Sale del recortador. Dice "Cancelar todo" cuando quedan varias imágenes en la cola porque descarta la cola completa.',
						steps: ['Hacé clic en el botón.'],
						warning:
							'Se pierden los recortes de esa tanda; los que ya habías aceptado antes se conservan.',
					},
				],
			},
		],
	},
	{
		id: 'catalog-list',
		title: 'Catálogos · Lista de Catálogos',
		summary:
			'Los ocho catálogos que alimentan los desplegables del formulario de productos. La mecánica es la misma en todos: filtrar, editar y activar o desactivar.',
		groups: [
			{
				title: 'Selector de catálogo',
				controls: [
					catalogTabsControl('Cada uno abre su propia tabla.'),
				],
			},
			{
				title: 'Acciones de la tabla',
				controls: [
					showInactiveControl('los registros'),
					{
						label: 'Sub-Categorías de una categoría (texto con "…")',
						kind: 'secondary',
						location: 'Columna central de la tabla de Categorías',
						what: 'No es un botón: muestra las dos primeras sub-categorías y, al pasar el mouse, la lista completa en un globo.',
						steps: [
							'Llevá el cursor sobre el texto que termina en "…".',
						],
					},
					activeSwitchControl('registro', 'el'),
					editPencilControl('registro', 'el'),
				],
			},
			modalFooterGroup('catálogo'),
		],
	},
	{
		id: 'create-catalog',
		title: 'Catálogos · Crear Catálogo',
		summary:
			'Un formulario de alta por catálogo. Todos comparten el mismo botón de confirmación, que cambia de texto según lo que estés creando.',
		groups: [
			{
				title: 'Selector de formulario',
				controls: [
					catalogTabsControl('Cada uno abre su propio formulario de alta.'),
				],
			},
			{
				title: 'Confirmación',
				controls: [
					{
						label: 'Crear Categoría / Crear Marca / Crear Color / Crear Esencia / Crear Emoción / Crear Sub-categoría / Crear Tipo de Vivienda / Crear Método de Pago',
						kind: 'primary',
						location: 'Abajo del formulario',
						what: 'Da de alta el registro. El texto del botón sigue al catálogo elegido y pasa a "Loading..." mientras guarda.',
						steps: [
							'Completá el nombre: es obligatorio y hasta que no lo escribas el botón queda deshabilitado.',
							'Completá los campos opcionales (por ejemplo el color en hexadecimal o las sub-categorías asociadas).',
							'Hacé clic en el botón; al terminar aparece el aviso de éxito y el formulario se vacía.',
						],
						tip: 'El formulario queda abierto después de guardar, pensado para cargar varios registros seguidos.',
					},
					{
						label: 'Selector de sub-categorías (Categoría)',
						kind: 'secondary',
						location: 'Dentro del formulario de Categoría',
						what: 'Permite asociar varias sub-categorías existentes a la categoría nueva.',
						steps: [
							'Escribí primero el nombre de la categoría: el selector está deshabilitado hasta entonces.',
							'Abrí el selector y marcá todas las sub-categorías que correspondan.',
						],
						tip: 'Solo lista sub-categorías ya creadas: si falta una, cargala primero desde la pestaña "Sub-Categoría".',
					},
				],
			},
		],
	},
	{
		id: 'user-list',
		title: 'Usuarios · Lista de Usuarios',
		summary:
			'Todas las cuentas registradas, con sus roles y su estado. Desde acá se editan los datos y se habilita o bloquea el acceso.',
		groups: [
			{
				title: 'Acciones de la tabla',
				controls: [
					showInactiveControl('los usuarios'),
					activeSwitchControl('usuario', 'el'),
					editPencilControl('usuario', 'el'),
				],
			},
			modalFooterGroup('usuario'),
		],
	},
	{
		id: 'role-list',
		title: 'Usuarios · Roles',
		summary:
			'Los roles que se asignan a las cuentas. Es la única tabla del panel con su propio botón de alta.',
		groups: [
			{
				title: 'Encabezado',
				controls: [
					{
						label: 'Crear',
						kind: 'primary',
						location: 'Arriba a la izquierda de la tabla',
						what: 'Abre la ventana de alta de un rol nuevo.',
						steps: [
							'Hacé clic en "Crear".',
							'Escribí el nombre del rol.',
							'Confirmá con "Crear" dentro de la ventana; la tabla se recarga sola.',
						],
					},
					showInactiveControl('los roles'),
				],
			},
			{
				title: 'Ventana "Crear rol"',
				controls: [
					{
						label: 'Crear',
						kind: 'primary',
						location: 'Abajo a la derecha de la ventana',
						what: 'Guarda el rol nuevo y cierra la ventana.',
						steps: [
							'Completá el nombre.',
							'Hacé clic en "Crear".',
						],
					},
					{
						label: 'Cancelar',
						kind: 'secondary',
						location: 'Abajo a la izquierda de la ventana',
						what: 'Cierra la ventana sin crear nada.',
						steps: ['Hacé clic en "Cancelar".'],
					},
				],
			},
			{
				title: 'Acciones sobre cada fila',
				controls: [
					activeSwitchControl('rol', 'el'),
					editPencilControl('rol', 'el'),
				],
			},
			modalFooterGroup('rol'),
		],
	},
	{
		id: 'order-list',
		title: 'Pedidos · Lista de Pedidos',
		summary:
			'Los pedidos de la tienda y del mostrador. Acá se hace seguir el estado de cada uno y se recorre el historial paginado.',
		groups: [
			{
				title: 'Cambio de estado',
				controls: [
					{
						label: 'Cambiar estado',
						kind: 'primary',
						location: 'Última columna de cada fila',
						what: 'Desplegable con los estados a los que puede pasar ese pedido. Solo ofrece transiciones válidas: de Pendiente a Pagado o Cancelado, de Pagado a Enviado, Cancelado o Reembolsado, y de Enviado a Entregado.',
						steps: [
							'Abrí el desplegable de la fila.',
							'Elegí el estado nuevo.',
							'Confirmá el cartel que pide verificación; el desplegable queda deshabilitado mientras guarda.',
						],
						warning:
							'Los estados finales (Entregado, Cancelado, Reembolsado) no se pueden revertir: la fila muestra "Sin acciones disponibles" y el desplegable desaparece.',
					},
				],
			},
			{
				title: 'Carga y paginado',
				controls: [
					{
						label: 'Reintentar',
						kind: 'secondary',
						location: 'Dentro de la tabla, cuando la carga falla',
						what: 'Vuelve a pedir la misma página que no se pudo cargar.',
						steps: ['Hacé clic en "Reintentar".'],
						tip: 'Reintenta la página en la que estabas, no la primera.',
					},
					{
						label: 'Anterior',
						kind: 'navigation',
						location: 'Abajo a la derecha, junto al indicador de página',
						what: 'Retrocede una página del listado.',
						steps: ['Hacé clic en "Anterior".'],
						tip: 'Se deshabilita solo cuando ya estás en la primera página.',
					},
					{
						label: 'Siguiente',
						kind: 'navigation',
						location: 'Abajo a la derecha, junto al indicador de página',
						what: 'Avanza una página del listado. Se muestran diez pedidos por página.',
						steps: ['Hacé clic en "Siguiente".'],
						tip: 'Se deshabilita en la última página; el texto del medio te indica en cuál estás.',
					},
				],
			},
		],
	},
	{
		id: 'pos-register-sale',
		title: 'Punto de Venta · Registrar Venta',
		summary:
			'La pantalla de venta en mostrador. Se arma una lista de productos, se elige el método de pago y se confirma; la venta descuenta stock.',
		groups: [
			{
				title: 'Armado de la venta',
				controls: [
					{
						label: 'Resultados de "Buscar producto"',
						kind: 'secondary',
						location: 'Lista que se despliega bajo el buscador',
						what: 'Cada resultado es un botón que selecciona ese producto. Muestra nombre, precio y stock disponible.',
						steps: [
							'Escribí al menos dos letras del nombre en "Buscar producto".',
							'Esperá un instante: la búsqueda se dispara sola y solo trae productos activos.',
							'Hacé clic en el resultado que corresponda; su nombre queda en el buscador.',
						],
						tip: 'Fijate en el stock que muestra cada resultado antes de cargar la cantidad.',
					},
					{
						label: 'Agregar',
						kind: 'primary',
						location: 'A la derecha del campo "Cantidad"',
						what: 'Suma el producto seleccionado a la lista de la venta con la cantidad indicada.',
						steps: [
							'Seleccioná un producto de la búsqueda: sin eso el botón está deshabilitado.',
							'Ajustá la cantidad (mínimo 1).',
							'Hacé clic en "Agregar"; el buscador y la cantidad se limpian para el siguiente ítem.',
						],
						tip: 'Si agregás dos veces el mismo producto, se suman las cantidades en una sola línea en lugar de duplicarla.',
					},
					{
						label: 'Tacho de basura',
						kind: 'destructive',
						location: 'A la derecha de cada línea de la venta',
						what: 'Quita esa línea de la venta. El total se recalcula al instante.',
						steps: ['Hacé clic en el tacho rojo de la línea.'],
					},
				],
			},
			{
				title: 'Cierre de la venta',
				controls: [
					{
						label: 'Método de pago',
						kind: 'secondary',
						location: 'Desplegable debajo del total',
						what: 'Elige con qué se paga. Las opciones vienen del catálogo de métodos de pago.',
						steps: [
							'Abrí el desplegable y elegí una opción.',
						],
						tip: 'Si falta una opción, agregala en Catálogos › Crear Catálogo › Método de Pago.',
					},
					{
						label: 'Registrar Venta',
						kind: 'primary',
						location: 'Abajo del formulario, centrado',
						what: 'Cierra la venta: la registra, descuenta el stock de cada producto y limpia la pantalla para la próxima.',
						steps: [
							'Verificá el total.',
							'Hacé clic en "Registrar Venta"; el botón pasa a "Registrando..." con un spinner.',
							'Al confirmarse, el formulario queda vacío y listo para otra venta.',
						],
						warning:
							'Sin productos cargados o sin método de pago la operación se rechaza con un aviso. Una venta ya registrada solo se deshace reembolsándola desde "Ventas".',
					},
				],
			},
		],
	},
	{
		id: 'pos-sales-list',
		title: 'Punto de Venta · Ventas',
		summary:
			'El historial de ventas de mostrador, con su estado y la única acción disponible sobre ellas: el reembolso.',
		groups: [
			{
				title: 'Acciones',
				controls: [
					{
						label: 'Reembolsar',
						kind: 'destructive',
						location: 'Última columna de cada fila',
						what: 'Marca la venta como reembolsada. El botón desaparece de la fila una vez aplicado.',
						steps: [
							'Ubicá la venta por fecha y productos.',
							'Hacé clic en "Reembolsar".',
							'Confirmá el cartel que menciona el número de venta; el botón pasa a "Reembolsando...".',
						],
						warning:
							'No se puede revertir: una venta reembolsada ya no ofrece el botón. Verificá el número de la venta en el cartel de confirmación antes de aceptar.',
					},
					{
						label: 'Reintentar',
						kind: 'secondary',
						location: 'Dentro de la tabla, cuando la carga falla',
						what: 'Vuelve a pedir el listado de ventas.',
						steps: ['Hacé clic en "Reintentar".'],
					},
				],
			},
		],
	},
	{
		id: 'review-list',
		title: 'Reseñas · Moderación de Reseñas',
		summary:
			'Las reseñas se moderan por producto: primero elegís el producto y después ocultás o vuelves a publicar cada reseña.',
		groups: [
			{
				title: 'Selección del producto',
				controls: [
					{
						label: 'Buscar producto',
						kind: 'secondary',
						location: 'Campo de texto arriba a la izquierda',
						what: 'Filtra la lista del desplegable de al lado. La búsqueda se aplica mientras escribís.',
						steps: [
							'Escribí parte del nombre del producto.',
							'Abrí el desplegable: ya viene filtrado.',
						],
					},
					{
						label: 'Seleccioná un producto',
						kind: 'primary',
						location: 'Desplegable al lado del buscador',
						what: 'Carga las reseñas del producto elegido. Hasta que no elijas uno, la tabla no muestra nada.',
						steps: [
							'Abrí el desplegable.',
							'Hacé clic en el producto.',
							'La tabla se llena con sus reseñas, o avisa que todavía no tiene ninguna.',
						],
					},
					{
						label: 'Mostrar inactivos',
						kind: 'toggle',
						location: 'Interruptor arriba a la derecha',
						what: 'Incluye en la tabla las reseñas que fueron ocultadas.',
						steps: [
							'Encendé el interruptor.',
							'Las reseñas inactivas aparecen atenuadas y con la etiqueta "Inactiva".',
						],
						tip: 'Encendelo para poder volver a publicar una reseña que habías ocultado.',
					},
				],
			},
			{
				title: 'Moderación',
				controls: [
					{
						label: 'Interruptor de la columna Acciones',
						kind: 'toggle',
						location: 'Dentro de cada fila de reseña',
						what: 'Publica u oculta la reseña en la ficha del producto. Apagarlo la saca de la tienda sin borrar el texto.',
						steps: [
							'Leé el comentario y el puntaje de la fila.',
							'Hacé clic en el interruptor.',
							'La etiqueta de la fila cambia entre "Activa" e "Inactiva" y aparece un aviso de confirmación.',
						],
						warning:
							'Una reseña oculta desaparece del promedio visible en la tienda. Para encontrarla de nuevo necesitás encender "Mostrar inactivos".',
					},
				],
			},
		],
	},
];

/**
 * The guide opens on the chapter for the page in view. Pages without a chapter
 * of their own fall back to the navigation one.
 */
export const getTutorialSectionId = (activePage: string): string =>
	dashboardTutorials.some((section) => section.id === activePage)
		? activePage
		: 'sidebar';
