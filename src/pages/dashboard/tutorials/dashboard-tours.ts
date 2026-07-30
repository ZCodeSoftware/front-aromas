import type { ITourDefinition } from './models/dashboard-tour.interface';

/**
 * Guided walkthroughs of the panel, one step at a time. Steps anchor to stable
 * containers (a toolbar, a table, a form field) instead of to a particular table
 * row, so a tour still works on an empty catalogue: the row-level controls are
 * explained while the whole table stays highlighted.
 */
export const dashboardTours: ITourDefinition[] = [
	{
		id: 'navigation',
		title: 'Conocer el panel',
		description:
			'El recorrido para arrancar: cómo está organizado el menú, cómo se abre cada pantalla y dónde volver a buscar ayuda.',
		minutes: 2,
		steps: [
			{
				page: 'home',
				target: 'dashboard-sidebar',
				title: 'Este es el menú lateral',
				body: 'Todo el panel se maneja desde acá. El menú queda siempre visible: cambiar de pantalla no recarga la página.',
				tip: 'La barra de arriba es la misma de la tienda, así que podés volver al sitio público o cerrar sesión sin salir del panel.',
			},
			{
				target: 'nav-item-home',
				title: '"Inicio" abre las métricas',
				body: 'Es la única entrada que no se despliega: lleva directo al tablero de analítica.',
				result: 'El botón queda resaltado y a la derecha aparecen las tarjetas de métricas.',
			},
			{
				target: 'nav-item-products',
				title: 'Los demás son grupos que se despliegan',
				body: 'Hacé clic en "Productos" para desplegarlo. Probá también con "Catálogos" o "Pedidos".',
				result: 'Debajo del nombre aparecen las pantallas que contiene el grupo.',
				tip: 'Solo queda un grupo abierto a la vez: al abrir otro, el anterior se cierra.',
			},
			{
				target: 'nav-subitem-product-list',
				title: 'Las sub-entradas abren la pantalla',
				body: 'Con el grupo desplegado, hacé clic en una de sus entradas, por ejemplo "Lista de Productos".',
				result: 'La que está en uso queda con fondo gris y el panel derecho se reemplaza.',
				warning:
					'Cambiar de pantalla descarta lo que hayas escrito en un formulario sin guardar.',
			},
			{
				target: 'dashboard-content',
				title: 'Acá trabajás',
				body: 'Este es el panel de contenido. Casi todas las pantallas repiten la misma estructura: una fila de botones arriba para elegir la vista y una tabla o un formulario debajo.',
			},
			{
				target: 'dashboard-help',
				title: 'Y acá vuelves a esta guía',
				body: 'El botón "?" abre siempre el índice de recorridos y la referencia de botones, con el capítulo de la pantalla que estés viendo ya seleccionado.',
				tip: 'Dentro de un recorrido podés usar las flechas ← y → del teclado para avanzar, y Escape para salir.',
			},
		],
	},
	{
		id: 'analytics',
		title: 'Leer las métricas del inicio',
		description:
			'Las cinco vistas del tablero y para qué sirve cada una. Ningún botón de esta pantalla modifica datos.',
		minutes: 3,
		steps: [
			{
				page: 'home',
				target: 'home-views',
				title: 'Cinco vistas, un solo tablero',
				body: 'Estos botones cambian qué métricas ves. El que está activo queda pintado en rosa.',
				tip: 'Podés hacer clic libremente: esta pantalla solo lee datos, no modifica nada.',
			},
			{
				target: 'home-view-overview',
				title: 'Resumen: el estado general',
				body: 'Hacé clic en "Resumen". Trae ingresos, ingresos cobrados, órdenes, órdenes pagadas, productos y usuarios.',
				result: 'Seis tarjetas arriba, y debajo el gráfico de ventas y los productos más vistos.',
				tip: 'Mirá el texto gris que está sobre las tarjetas: te dice a qué rango de fechas corresponden los números.',
			},
			{
				target: 'home-groupby',
				title: 'Ajustá la escala del gráfico',
				body: 'En la tarjeta "Ventas en el tiempo", elegí Día, Semana o Mes.',
				result: 'El gráfico se vuelve a pedir al servidor y se redibuja con la nueva agrupación.',
				tip: 'Usá "Día" para ver el efecto de una promoción puntual y "Mes" para ver la tendencia sin el ruido diario.',
			},
			{
				target: 'home-view-breakdown',
				title: 'Canales: de dónde viene la plata',
				body: 'Hacé clic en "Canales" para separar las ventas de la tienda online de las del mostrador, y ver el peso de cada método de pago.',
			},
			{
				target: 'home-view-inventory',
				title: 'Inventario: qué reponer',
				body: 'Hacé clic en "Inventario". Lista los productos sin stock, los que tienen stock bajo y los más vendidos.',
				tip: 'Es el atajo para saber qué reponer sin recorrer la lista completa de productos.',
			},
			{
				target: 'home-view-customers',
				title: 'Clientes: quién compra',
				body: 'Hacé clic en "Clientes" para ver cuántos son nuevos, cuántos recurrentes y quiénes más compraron.',
			},
			{
				target: 'home-view-conversion',
				title: 'Conversión: dónde se pierden las ventas',
				body: 'Hacé clic en "Conversión". Relaciona visitas, carritos y compras.',
				tip: 'Si hay muchos carritos y pocas compras, el problema está en el checkout, no en el catálogo.',
			},
		],
	},
	{
		id: 'create-product',
		title: 'Cargar un producto de principio a fin',
		description:
			'El recorrido más largo: los campos obligatorios, la carga de imágenes, el recortador y la confirmación.',
		minutes: 6,
		steps: [
			{
				page: 'create-product',
				target: 'product-name',
				title: 'Empezá por el nombre',
				body: 'Escribí el nombre del producto, por ejemplo "Vela Aromática de Lavanda".',
				warning:
					'El nombre no es solo obligatorio: hasta que no lo escribas, la carga de imágenes queda bloqueada y avisa en rojo.',
			},
			{
				target: 'product-category',
				title: 'Elegí la categoría',
				body: 'Abrí el desplegable "Categoría" y elegí una. Es el segundo campo obligatorio.',
				result: 'Al elegirla se habilita "Sub-Categoría", que solo lista las sub-categorías de esa categoría.',
				tip: 'Si la categoría que buscás no está, cargala primero en Catálogos › Crear Catálogo.',
			},
			{
				title: 'Los campos de clasificación son opcionales',
				body: 'Marca, Color, Esencia Principal y Emoción Asociada podés dejarlos vacíos. Se usan para los filtros de la tienda, así que conviene completarlos.',
				tip: 'Todos se alimentan de los catálogos: lo que no aparezca en el desplegable hay que crearlo antes.',
			},
			{
				target: 'product-price',
				title: 'Precio y stock',
				body: 'Completá el precio, que es el tercer campo obligatorio, y el stock inicial a la derecha.',
				warning:
					'Si dejás un campo en rojo, el botón de crear queda deshabilitado hasta que lo corrijas.',
			},
			{
				target: 'product-upload',
				title: 'Ahora las imágenes',
				body: 'Hacé clic en "Cargar imágenes".',
				result: 'Se despliega una zona punteada para arrastrar archivos o hacer clic y elegirlos.',
				tip: 'Se aceptan varias imágenes por producto, en proporción 16:9 y hasta 10 MB cada una.',
			},
			{
				target: 'product-upload',
				title: 'Elegí los archivos',
				body: 'Arrastrá las imágenes a la zona punteada, o hacé clic en ella para abrir el explorador de archivos.',
				result: 'Cada imagen pasa al recortador, una por una.',
			},
			{
				title: 'Si algún archivo pesa demasiado',
				body: 'Cuando un archivo supera los 10 MB aparece un aviso con la lista de archivos pesados. "Redimensionar" los comprime automáticamente y los manda al recortador; "Cancelar" los descarta.',
				warning:
					'Los archivos que sigan pasando el límite después de comprimirlos se descartan con un aviso.',
			},
			{
				title: 'Encuadrá la imagen en el recortador',
				body: 'Arrastrá la imagen con el mouse para elegir qué queda dentro del marco 16:9, y usá la barra de zoom para acercarla. La flecha circular devuelve el zoom al 100%.',
				tip: 'El contador "Imagen X de Y" te dice cuántas quedan en la cola.',
			},
			{
				title: 'Confirmá cada recorte',
				body: 'El botón dice "Siguiente" mientras queden imágenes por recortar y "Finalizar y Aceptar" en la última. "Cancelar todo" descarta la cola completa.',
				result: 'Al aceptar la última, los recortes aparecen en la sección "Vista previa" del formulario.',
				tip: 'Las imágenes recién se suben al servidor cuando presionás "Crear Producto": hasta entonces viven en tu navegador.',
			},
			{
				target: 'product-upload',
				title: 'Revisá la vista previa',
				body: 'Pasá el mouse sobre una miniatura y hacé clic en la X roja para quitar esa imagen. "Cancelar Carga" en cambio vacía la selección completa.',
				warning:
					'"Cancelar Carga" borra todas las imágenes ya recortadas, no solo la última.',
			},
			{
				target: 'product-submit',
				title: 'Creá el producto',
				body: 'Hacé clic en "Crear Producto". El botón pasa a decir "Creando..." mientras suben las imágenes y se guarda el producto.',
				result: 'Aparece el aviso de éxito y el formulario se vacía, listo para el siguiente producto.',
				tip: 'Para verlo en la tienda, andá a Productos › Lista de Productos: se crea activo por defecto.',
			},
		],
	},
	{
		id: 'manage-products',
		title: 'Editar y dar de baja un producto',
		description:
			'Cómo corregir un producto ya publicado, sacarlo de la tienda sin borrarlo y volver a encontrarlo después.',
		minutes: 3,
		steps: [
			{
				page: 'product-list',
				target: 'products-table',
				title: 'La tabla del catálogo',
				body: 'Cada fila es un producto, con su categoría, marca, precio y stock. Por defecto solo se listan los activos.',
			},
			{
				target: 'products-table',
				title: 'Los nombres esconden la descripción',
				body: 'Llevá el cursor sobre un nombre subrayado con línea de puntos.',
				result: 'Un globo muestra la descripción completa del producto.',
				tip: 'Si dice "Sin descripción", el producto está publicado sin texto: conviene completarlo.',
			},
			{
				target: 'products-table',
				title: 'La columna "Activo" saca el producto de la tienda',
				body: 'El interruptor de cada fila publica o despublica ese producto. Queda deshabilitado mientras se guarda.',
				warning:
					'La baja es lógica, no física: el producto y su historial se conservan, pero deja de listarse y desaparece de la tabla.',
			},
			{
				target: 'show-inactive',
				title: 'Así recuperás lo que desactivaste',
				body: 'Encendé "Mostrar inactivos".',
				result: 'La tabla se recarga con activos e inactivos; las filas inactivas se ven atenuadas.',
				tip: 'Es el único camino para reactivar un producto: primero mostralo, después volvé a encender su interruptor.',
			},
			{
				target: 'products-table',
				title: 'El lápiz abre la edición',
				body: 'En la columna "Acciones", hacé clic en el lápiz de la fila que quieras corregir.',
				result: 'Se abre una ventana con todos los datos del producto ya cargados.',
			},
			{
				title: 'Guardar o descartar',
				body: '"Guardar Cambios" envía la edición y cierra la ventana; la tabla se recarga sola. "Cancelar", o la X de la esquina, cierra sin guardar nada.',
				tip: 'El botón de guardar queda deshabilitado mientras falte un obligatorio o haya un error de validación.',
			},
		],
	},
	{
		id: 'catalogs',
		title: 'Armar los catálogos',
		description:
			'Los ocho catálogos que alimentan los desplegables del formulario de productos, y en qué orden conviene cargarlos.',
		minutes: 4,
		steps: [
			{
				page: 'create-catalog',
				target: 'create-catalog-tabs',
				title: 'Un formulario por catálogo',
				body: 'Estos ocho botones eligen qué estás creando: categorías, sub-categorías, marcas, emociones, colores, esencias, tipos de vivienda o métodos de pago.',
				tip: 'Conviene empezar por "Sub-Categoría": las categorías se arman agrupando sub-categorías que ya existan.',
			},
			{
				target: 'create-catalog-form',
				title: 'Cargá una sub-categoría',
				body: 'Con "Sub-Categoría" seleccionada, escribí el nombre y presioná "Crear Sub-categoría".',
				result: 'Aparece el aviso de éxito y el formulario se vacía, pero no se cierra: está pensado para cargar varios registros seguidos.',
				warning:
					'El botón queda deshabilitado hasta que el nombre tenga contenido.',
			},
			{
				target: 'create-catalog-tabs',
				title: 'Ahora sí, la categoría',
				body: 'Volvé a la pestaña "Categoría" y escribí su nombre.',
				result: 'Al escribir el nombre se habilita el selector de sub-categorías de abajo.',
			},
			{
				target: 'create-catalog-form',
				title: 'Asociá las sub-categorías',
				body: 'Abrí el selector "Sub-Categoría" y marcá todas las que correspondan a esta categoría. Después presioná "Crear Categoría".',
				tip: 'Solo lista sub-categorías ya creadas. El formulario de Color además pide el valor hexadecimal, que se previsualiza al lado del nombre.',
			},
			{
				page: 'catalog-list',
				target: 'catalog-tabs',
				title: 'Revisá lo cargado',
				body: 'En Catálogos › Lista de Catálogos, estos botones cambian de qué catálogo ves la tabla.',
				result: 'El catálogo activo queda pintado en rosa y la tabla de abajo se reemplaza.',
			},
			{
				target: 'catalogs-table',
				title: 'Corregir y dar de baja',
				body: 'El lápiz de la columna "Acciones" abre la edición; el interruptor de la columna "Estado" saca el registro de los desplegables del formulario de productos.',
				warning:
					'Desactivar una categoría no toca los productos que ya la usan, pero deja de ofrecerse para nuevos productos.',
			},
			{
				target: 'show-inactive',
				title: 'Y para volver atrás',
				body: 'Encendé "Mostrar inactivos" para ver los registros dados de baja y poder reactivarlos.',
				tip: 'En la tabla de Categorías, el texto que termina en "…" muestra la lista completa de sub-categorías al pasar el mouse.',
			},
		],
	},
	{
		id: 'users-roles',
		title: 'Gestionar usuarios y roles',
		description:
			'Crear un rol, asignárselo a una cuenta y bloquear el acceso de un usuario sin borrarlo.',
		minutes: 3,
		steps: [
			{
				page: 'role-list',
				target: 'role-create',
				title: 'Los roles se crean acá',
				body: 'Esta es la única tabla del panel con su propio botón de alta. Hacé clic en "Crear".',
				result: 'Se abre una ventana que pide solamente el nombre del rol.',
			},
			{
				title: 'Confirmá el rol',
				body: 'Escribí el nombre y presioná "Crear" dentro de la ventana. "Cancelar" la cierra sin guardar.',
				result: 'La ventana se cierra y la tabla de roles se recarga sola con el rol nuevo.',
			},
			{
				target: 'roles-table',
				title: 'Editar y desactivar roles',
				body: 'El lápiz renombra el rol; el interruptor de "Estado" lo saca de circulación sin borrarlo.',
				warning:
					'Un rol desactivado deja de ofrecerse al editar usuarios, pero los que ya lo tenían asignado lo conservan.',
			},
			{
				page: 'user-list',
				target: 'users-table',
				title: 'Las cuentas registradas',
				body: 'Cada fila muestra email, nombre, teléfono, los roles asignados y el estado de la cuenta.',
			},
			{
				target: 'users-table',
				title: 'El lápiz asigna los roles',
				body: 'Hacé clic en el lápiz de una fila para abrir la edición del usuario y cambiar sus datos o sus roles.',
				result: 'La ventana se abre con los datos actuales; "Guardar cambios" los aplica y recarga la tabla.',
			},
			{
				target: 'users-table',
				title: 'El interruptor bloquea el acceso',
				body: 'Apagar el interruptor de la columna "Estado" desactiva la cuenta.',
				warning:
					'El usuario deja de poder entrar, pero sus pedidos y reseñas se conservan. Para reactivarlo necesitás encender "Mostrar inactivos".',
			},
			{
				target: 'show-inactive',
				title: 'Recuperar una cuenta desactivada',
				body: 'Encendé "Mostrar inactivos" y volvé a encender el interruptor de la fila atenuada.',
			},
		],
	},
	{
		id: 'orders',
		title: 'Seguir un pedido hasta la entrega',
		description:
			'Cómo avanzan los estados de un pedido, qué transiciones permite el sistema y cómo recorrer el historial.',
		minutes: 3,
		steps: [
			{
				page: 'order-list',
				target: 'orders-table',
				title: 'Los pedidos de los dos canales',
				body: 'La tabla mezcla los pedidos de la tienda online y las ventas de mostrador; la columna "Canal" los distingue.',
				tip: 'Una venta de mostrador sin datos de cliente aparece como "Consumidor final".',
			},
			{
				target: 'orders-table',
				title: 'El estado se cambia desde la fila',
				body: 'Abrí el desplegable "Cambiar estado" de un pedido. Solo ofrece los estados a los que ese pedido puede pasar.',
				tip: 'Pendiente pasa a Pagado o Cancelado; Pagado a Enviado, Cancelado o Reembolsado; Enviado solo a Entregado.',
			},
			{
				title: 'Siempre pide confirmación',
				body: 'Al elegir un estado aparece un cartel con el número de pedido y el estado destino. Aceptá para aplicarlo.',
				result: 'El desplegable queda deshabilitado mientras guarda y la fila se actualiza con la etiqueta nueva.',
			},
			{
				target: 'orders-table',
				title: 'Los estados finales no se revierten',
				body: 'Entregado, Cancelado y Reembolsado son definitivos: esas filas muestran "Sin acciones disponibles" y ya no ofrecen el desplegable.',
				warning:
					'Verificá el número de pedido en el cartel de confirmación antes de aceptar: no hay vuelta atrás.',
			},
			{
				target: 'orders-pagination',
				title: 'Recorrer el historial',
				body: 'Se muestran diez pedidos por página. "Anterior" y "Siguiente" se mueven entre páginas y el texto del medio te dice en cuál estás.',
				tip: 'Cada botón se deshabilita solo cuando no hay más páginas en esa dirección.',
			},
			{
				title: 'Si la carga falla',
				body: 'Cuando el listado no se puede traer, la tabla muestra un botón "Reintentar" que vuelve a pedir la misma página en la que estabas, no la primera.',
			},
		],
	},
	{
		id: 'pos-sale',
		title: 'Registrar una venta en el mostrador',
		description:
			'Armar la venta producto por producto, elegir el método de pago y cerrarla descontando stock.',
		minutes: 4,
		steps: [
			{
				page: 'pos-register-sale',
				target: 'pos-search',
				title: 'Buscá el primer producto',
				body: 'Escribí al menos dos letras del nombre. La búsqueda se dispara sola después de una pausa breve y solo trae productos activos.',
				result: 'Debajo del campo se despliega la lista de coincidencias.',
			},
			{
				target: 'pos-search',
				title: 'Elegí un resultado',
				body: 'Cada resultado muestra nombre, precio y stock disponible. Hacé clic en el que corresponda.',
				result: 'El nombre del producto queda escrito en el buscador y la lista se cierra.',
				tip: 'Mirá el stock que muestra el resultado antes de cargar la cantidad.',
			},
			{
				target: 'pos-quantity',
				title: 'Cargá la cantidad',
				body: 'Ajustá el campo "Cantidad". El mínimo es 1.',
			},
			{
				target: 'pos-add',
				title: 'Sumalo a la venta',
				body: 'Hacé clic en "Agregar". El botón está deshabilitado hasta que haya un producto seleccionado.',
				result: 'El producto aparece en la lista de abajo y el buscador se limpia para el siguiente ítem.',
				tip: 'Si agregás dos veces el mismo producto, se suman las cantidades en una sola línea en lugar de duplicarla.',
			},
			{
				target: 'pos-lines',
				title: 'Revisá la lista y el total',
				body: 'Cada línea muestra el producto, la cantidad por el precio unitario y el subtotal. El tacho rojo de la derecha quita esa línea.',
				result: 'El total de abajo se recalcula al instante con cada cambio.',
			},
			{
				target: 'pos-payment',
				title: 'Elegí el método de pago',
				body: 'Abrí el desplegable y elegí con qué paga el cliente. Es obligatorio.',
				tip: 'Las opciones vienen del catálogo: si falta una, agregala en Catálogos › Crear Catálogo › Método de Pago.',
			},
			{
				target: 'pos-submit',
				title: 'Cerrá la venta',
				body: 'Verificá el total y hacé clic en "Registrar Venta". El botón pasa a decir "Registrando...".',
				result: 'Se registra la venta, se descuenta el stock de cada producto y la pantalla queda vacía para la próxima.',
				warning:
					'Sin productos cargados o sin método de pago la operación se rechaza. Una venta ya registrada solo se deshace reembolsándola desde Punto de Venta › Ventas.',
			},
		],
	},
	{
		id: 'pos-refund',
		title: 'Reembolsar una venta',
		description:
			'La única acción disponible sobre una venta ya cerrada, y por qué conviene revisarla dos veces.',
		minutes: 2,
		steps: [
			{
				page: 'pos-sales-list',
				target: 'sales-table',
				title: 'El historial del mostrador',
				body: 'Cada fila es una venta, con su fecha y hora, el detalle de productos, el total y su estado.',
				tip: 'La columna de productos se recorta si es larga: la venta completa se identifica por fecha y total.',
			},
			{
				target: 'sales-table',
				title: 'El botón "Reembolsar"',
				body: 'Está en la columna "Acciones" de cada venta que todavía no fue reembolsada. Hacé clic para iniciar el reembolso.',
				result: 'Aparece un cartel de confirmación con el número de la venta.',
			},
			{
				title: 'Confirmá con cuidado',
				body: 'Leé el número de venta en el cartel y aceptá. El botón pasa a decir "Reembolsando..." mientras se procesa.',
				warning:
					'No se puede revertir. Una venta reembolsada cambia de estado y ya no vuelve a ofrecer el botón.',
			},
			{
				title: 'Si el listado no carga',
				body: 'Cuando la carga falla, la tabla muestra un botón "Reintentar" que vuelve a pedir las ventas.',
				tip: 'Un reembolso aplicado se refleja en la fila sin recargar la lista, así que no vas a ver el botón dos veces sobre la misma venta.',
			},
		],
	},
	{
		id: 'reviews',
		title: 'Moderar reseñas',
		description:
			'Las reseñas se moderan producto por producto: cómo encontrarlas, ocultarlas y volver a publicarlas.',
		minutes: 2,
		steps: [
			{
				page: 'review-list',
				target: 'reviews-filters',
				title: 'Primero se elige el producto',
				body: 'La moderación no es una lista general: hasta que no elijas un producto, la tabla no muestra nada.',
			},
			{
				target: 'reviews-filters',
				title: 'Filtrá con el buscador',
				body: 'Escribí parte del nombre en "Buscar producto". El desplegable de al lado se filtra mientras escribís.',
				tip: 'El buscador solo lista productos activos.',
			},
			{
				target: 'reviews-filters',
				title: 'Seleccioná el producto',
				body: 'Abrí el desplegable y hacé clic en el producto.',
				result: 'La tabla se llena con sus reseñas, o avisa que todavía no tiene ninguna.',
			},
			{
				target: 'reviews-table',
				title: 'Ocultá o publicá cada reseña',
				body: 'Leé el puntaje y el comentario de la fila, y usá el interruptor de la columna "Acciones" para publicarla u ocultarla.',
				result: 'La etiqueta de la fila cambia entre "Activa" e "Inactiva" y aparece un aviso de confirmación.',
				warning:
					'Una reseña oculta desaparece del promedio visible en la tienda, pero su texto no se borra.',
			},
			{
				target: 'show-inactive',
				title: 'Para volver a publicarla',
				body: 'Encendé "Mostrar inactivos": las reseñas ocultas reaparecen atenuadas y con la etiqueta "Inactiva", y ahí podés volver a encender su interruptor.',
			},
		],
	},
];

/** Tours that walk through the page currently in view, to suggest them first. */
export const getToursForPage = (activePage: string): ITourDefinition[] =>
	dashboardTours.filter((tour) =>
		tour.steps.some((step) => step.page === activePage)
	);
