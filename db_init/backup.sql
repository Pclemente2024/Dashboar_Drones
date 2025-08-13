--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-07-30 14:44:02

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
--SET transaction_timeout = 0;  
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 230 (class 1259 OID 16523)
-- Name: alertas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alertas (
    id integer NOT NULL,
    historial_vuelo_id integer NOT NULL,
    termino_alerta_id integer NOT NULL,
    mensaje text NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    resuelta boolean DEFAULT false
);


ALTER TABLE public.alertas OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16522)
-- Name: alertas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.alertas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alertas_id_seq OWNER TO postgres;

--
-- TOC entry 4984 (class 0 OID 0)
-- Dependencies: 229
-- Name: alertas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.alertas_id_seq OWNED BY public.alertas.id;


--
-- TOC entry 222 (class 1259 OID 16473)
-- Name: drones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.drones (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    serial_number character varying(100) NOT NULL,
    estado character varying(50),
    bateria_capacidad_maxima integer,
    velocidad numeric(10,2),
    altitud_maxima_operativa numeric(10,2),
    CONSTRAINT drones_estado_check CHECK (((estado)::text = ANY ((ARRAY['activo'::character varying, 'mantenimiento'::character varying, 'inactivo'::character varying, 'averiado'::character varying])::text[])))
);


ALTER TABLE public.drones OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16472)
-- Name: drones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.drones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.drones_id_seq OWNER TO postgres;

--
-- TOC entry 4985 (class 0 OID 0)
-- Dependencies: 221
-- Name: drones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.drones_id_seq OWNED BY public.drones.id;


--
-- TOC entry 226 (class 1259 OID 16495)
-- Name: historial_vuelos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial_vuelos (
    id integer NOT NULL,
    dron_id integer NOT NULL,
    usuario_id integer NOT NULL,
    vuelo_bruto_inicio_id integer,
    vuelo_bruto_fin_id integer,
    altura_maxima numeric(10,2),
    distancia_total numeric(10,2),
    bateria_inicial integer,
    bateria_final integer,
    estado character varying(50),
    CONSTRAINT historial_vuelos_estado_check CHECK (((estado)::text = ANY ((ARRAY['completado'::character varying, 'en_progreso'::character varying, 'cancelado'::character varying, 'fallido'::character varying])::text[])))
);


ALTER TABLE public.historial_vuelos OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16494)
-- Name: historial_vuelos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historial_vuelos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historial_vuelos_id_seq OWNER TO postgres;

--
-- TOC entry 4986 (class 0 OID 0)
-- Dependencies: 225
-- Name: historial_vuelos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historial_vuelos_id_seq OWNED BY public.historial_vuelos.id;


--
-- TOC entry 218 (class 1259 OID 16452)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16451)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- TOC entry 4987 (class 0 OID 0)
-- Dependencies: 217
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- TOC entry 228 (class 1259 OID 16513)
-- Name: terminologia_alertas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.terminologia_alertas (
    id integer NOT NULL,
    tipo character varying(50) NOT NULL,
    descripcion text,
    nivel character varying(20),
    CONSTRAINT terminologia_alertas_nivel_check CHECK (((nivel)::text = ANY ((ARRAY['info'::character varying, 'advertencia'::character varying, 'critico'::character varying])::text[])))
);


ALTER TABLE public.terminologia_alertas OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16512)
-- Name: terminologia_alertas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.terminologia_alertas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.terminologia_alertas_id_seq OWNER TO postgres;

--
-- TOC entry 4988 (class 0 OID 0)
-- Dependencies: 227
-- Name: terminologia_alertas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.terminologia_alertas_id_seq OWNED BY public.terminologia_alertas.id;


--
-- TOC entry 220 (class 1259 OID 16459)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido character varying(100) NOT NULL,
    correo character varying(100) NOT NULL,
    "contraseña" character varying(100) NOT NULL,
    telefono_celular character varying(20),
    rol_id integer NOT NULL
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16458)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 4989 (class 0 OID 0)
-- Dependencies: 219
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 232 (class 1259 OID 16544)
-- Name: videos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.videos (
    id integer NOT NULL,
    historial_vuelo_id integer NOT NULL,
    ruta_archivo character varying(255) NOT NULL,
    duracion_segundos integer,
    fecha_hora timestamp without time zone,
    resolucion character varying(20),
    formato character varying(10)
);


ALTER TABLE public.videos OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16543)
-- Name: videos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.videos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.videos_id_seq OWNER TO postgres;

--
-- TOC entry 4990 (class 0 OID 0)
-- Dependencies: 231
-- Name: videos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.videos_id_seq OWNED BY public.videos.id;


--
-- TOC entry 224 (class 1259 OID 16488)
-- Name: vuelos_bruto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vuelos_bruto (
    id integer NOT NULL,
    "timestamp" timestamp without time zone NOT NULL,
    latitud numeric(10,8) NOT NULL,
    longitud numeric(11,8) NOT NULL,
    altura numeric(10,2) NOT NULL,
    velocidad_airspeed numeric(10,2),
    velocidad_groundspeed numeric(10,2),
    climb_rate numeric(10,2),
    heading numeric(10,2),
    voltaje_bateria numeric(5,2),
    porcentaje_bateria integer,
    numero_satelites integer,
    dron_id integer
);


ALTER TABLE public.vuelos_bruto OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16487)
-- Name: vuelos_bruto_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vuelos_bruto_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vuelos_bruto_id_seq OWNER TO postgres;

--
-- TOC entry 4991 (class 0 OID 0)
-- Dependencies: 223
-- Name: vuelos_bruto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vuelos_bruto_id_seq OWNED BY public.vuelos_bruto.id;


--
-- TOC entry 4783 (class 2604 OID 16526)
-- Name: alertas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alertas ALTER COLUMN id SET DEFAULT nextval('public.alertas_id_seq'::regclass);


--
-- TOC entry 4779 (class 2604 OID 16476)
-- Name: drones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drones ALTER COLUMN id SET DEFAULT nextval('public.drones_id_seq'::regclass);


--
-- TOC entry 4781 (class 2604 OID 16498)
-- Name: historial_vuelos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_vuelos ALTER COLUMN id SET DEFAULT nextval('public.historial_vuelos_id_seq'::regclass);


--
-- TOC entry 4777 (class 2604 OID 16455)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 4782 (class 2604 OID 16516)
-- Name: terminologia_alertas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.terminologia_alertas ALTER COLUMN id SET DEFAULT nextval('public.terminologia_alertas_id_seq'::regclass);


--
-- TOC entry 4778 (class 2604 OID 16462)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 4786 (class 2604 OID 16547)
-- Name: videos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.videos ALTER COLUMN id SET DEFAULT nextval('public.videos_id_seq'::regclass);


--
-- TOC entry 4780 (class 2604 OID 16491)
-- Name: vuelos_bruto id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vuelos_bruto ALTER COLUMN id SET DEFAULT nextval('public.vuelos_bruto_id_seq'::regclass);


--
-- TOC entry 4976 (class 0 OID 16523)
-- Dependencies: 230
-- Data for Name: alertas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alertas (id, historial_vuelo_id, termino_alerta_id, mensaje, "timestamp", resuelta) FROM stdin;
\.


--
-- TOC entry 4968 (class 0 OID 16473)
-- Dependencies: 222
-- Data for Name: drones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.drones (id, usuario_id, serial_number, estado, bateria_capacidad_maxima, velocidad, altitud_maxima_operativa) FROM stdin;
1	1	DRN001	activo	100	50.00	200.00
\.


--
-- TOC entry 4972 (class 0 OID 16495)
-- Dependencies: 226
-- Data for Name: historial_vuelos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historial_vuelos (id, dron_id, usuario_id, vuelo_bruto_inicio_id, vuelo_bruto_fin_id, altura_maxima, distancia_total, bateria_inicial, bateria_final, estado) FROM stdin;
\.


--
-- TOC entry 4964 (class 0 OID 16452)
-- Dependencies: 218
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, nombre) FROM stdin;
1	usuario
2	admin
\.


--
-- TOC entry 4974 (class 0 OID 16513)
-- Dependencies: 228
-- Data for Name: terminologia_alertas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.terminologia_alertas (id, tipo, descripcion, nivel) FROM stdin;
\.


--
-- TOC entry 4966 (class 0 OID 16459)
-- Dependencies: 220
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, nombre, apellido, correo, "contraseña", telefono_celular, rol_id) FROM stdin;
1	Admin	Principal	admin@ejemplo.com	admin123	0999015478	2
2	Carlos	García	usuario1@ejemplo.com	usuario123	0994847848	1
3	María	López	usuario2@ejemplo.com	usuario123	0984855578	1
\.


--
-- TOC entry 4978 (class 0 OID 16544)
-- Dependencies: 232
-- Data for Name: videos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.videos (id, historial_vuelo_id, ruta_archivo, duracion_segundos, fecha_hora, resolucion, formato) FROM stdin;
\.


--
-- TOC entry 4970 (class 0 OID 16488)
-- Dependencies: 224
-- Data for Name: vuelos_bruto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vuelos_bruto (id, "timestamp", latitud, longitud, altura, velocidad_airspeed, velocidad_groundspeed, climb_rate, heading, voltaje_bateria, porcentaje_bateria, numero_satelites, dron_id) FROM stdin;
2	2025-07-02 14:53:46.635	-2.19090000	-79.88930000	120.00	55.00	52.00	0.60	180.00	11.20	100	12	1
3	2025-07-02 14:54:57.695	-2.19090000	-79.88930000	120.00	55.00	52.00	0.60	180.00	11.20	100	12	1
4	2025-07-02 14:55:14.852	-2.19090000	-79.88930000	120.00	55.00	52.00	0.60	180.00	11.20	50	12	1
5	2025-07-02 15:46:47.42	-2.18821505	-79.88881807	127.21	52.25	50.04	0.66	65.00	10.27	63	12	1
6	2025-07-02 15:46:57.395	-2.18937435	-79.88820449	124.14	53.77	54.29	0.68	327.00	10.30	44	10	1
7	2025-07-02 15:57:33.549	-2.18800858	-79.88798528	123.48	56.89	54.73	0.56	198.00	10.92	59	10	1
8	2025-07-02 15:57:43.53	-2.18868775	-79.88834483	123.88	50.05	57.50	0.51	344.00	10.82	59	11	1
9	2025-07-02 15:57:53.534	-2.18990328	-79.88739154	120.73	58.17	59.16	0.68	330.00	10.02	44	11	1
10	2025-07-02 15:58:03.535	-2.18946692	-79.88777969	121.25	58.19	51.19	0.64	231.00	10.25	42	12	1
11	2025-07-02 15:58:13.544	-2.18970869	-79.88700527	121.90	50.50	58.44	0.56	156.00	10.12	69	12	1
12	2025-07-02 15:58:23.54	-2.18997986	-79.88889649	126.69	58.37	51.69	0.62	306.00	10.91	69	12	1
13	2025-07-02 15:58:33.562	-2.18867469	-79.88714736	121.56	51.61	59.56	0.69	186.00	10.19	51	11	1
14	2025-07-02 15:58:43.553	-2.18981844	-79.88864346	126.95	57.49	59.62	0.65	54.00	10.59	64	12	1
15	2025-07-02 15:58:53.562	-2.18854463	-79.88844009	126.73	57.99	59.67	0.58	110.00	10.01	43	10	1
16	2025-07-02 15:59:03.562	-2.18920741	-79.88766925	128.31	55.96	53.39	0.68	42.00	10.22	44	12	1
17	2025-07-02 15:59:13.57	-2.18894049	-79.88875880	126.46	55.15	55.01	0.53	90.00	10.61	40	12	1
18	2025-07-02 15:59:23.572	-2.18878702	-79.88839388	120.34	53.21	52.54	0.60	340.00	10.64	34	12	1
19	2025-07-02 15:59:33.583	-2.18866428	-79.88894041	122.29	59.71	52.56	0.57	93.00	10.51	38	11	1
20	2025-07-02 15:59:43.587	-2.18824986	-79.88815925	120.19	58.60	53.94	0.61	158.00	10.74	37	11	1
21	2025-07-02 15:59:53.599	-2.18858567	-79.88723921	129.07	51.57	54.49	0.62	13.00	10.24	46	12	1
22	2025-07-02 16:00:03.615	-2.18985441	-79.88705659	121.16	54.55	55.32	0.51	165.00	10.25	56	10	1
23	2025-07-02 16:00:13.608	-2.18890090	-79.88881582	125.79	56.30	52.00	0.55	76.00	10.01	62	12	1
24	2025-07-02 16:00:23.617	-2.18916283	-79.88888915	125.70	54.14	50.34	0.69	212.00	10.39	48	12	1
25	2025-07-02 16:00:33.621	-2.18846844	-79.88817588	120.44	53.71	54.29	0.68	328.00	10.62	60	11	1
26	2025-07-02 16:00:43.632	-2.18898871	-79.88831966	125.35	59.72	57.43	0.68	275.00	10.46	53	10	1
27	2025-07-02 16:00:53.634	-2.18856844	-79.88813158	123.02	50.58	57.75	0.58	28.00	10.44	43	12	1
28	2025-07-02 16:01:03.639	-2.18968108	-79.88775144	129.41	56.74	52.42	0.66	140.00	10.73	51	10	1
29	2025-07-02 16:01:13.639	-2.18836846	-79.88835087	128.62	55.89	59.40	0.59	50.00	10.99	34	11	1
30	2025-07-02 16:01:23.65	-2.18811892	-79.88712026	127.50	56.83	53.42	0.60	259.00	10.82	59	12	1
31	2025-07-02 16:01:33.651	-2.18806164	-79.88713430	125.63	51.49	54.93	0.69	54.00	10.40	48	12	1
32	2025-07-02 16:01:43.659	-2.18870992	-79.88793797	124.28	53.42	57.50	0.58	295.00	10.99	46	12	1
33	2025-07-02 16:01:53.662	-2.18891714	-79.88754131	126.50	52.99	53.92	0.62	34.00	10.85	58	11	1
34	2025-07-02 16:02:03.659	-2.18836836	-79.88870297	122.89	51.91	51.24	0.60	286.00	10.14	63	10	1
35	2025-07-02 16:02:13.666	-2.18813589	-79.88818959	126.79	55.37	51.61	0.54	358.00	10.41	60	12	1
36	2025-07-02 16:02:23.672	-2.18802210	-79.88738277	127.30	50.19	59.99	0.59	129.00	10.56	68	10	1
37	2025-07-02 16:02:33.678	-2.18850968	-79.88849683	125.93	51.25	52.25	0.68	80.00	10.45	46	11	1
38	2025-07-02 16:02:43.683	-2.18820172	-79.88856634	122.54	57.89	59.99	0.63	259.00	10.59	30	10	1
39	2025-07-02 16:02:53.692	-2.18892553	-79.88740836	126.64	57.30	57.69	0.53	141.00	10.82	38	10	1
40	2025-07-02 16:03:03.701	-2.18940952	-79.88775909	128.25	53.41	55.94	0.59	299.00	10.02	31	12	1
41	2025-07-02 16:03:13.71	-2.18972780	-79.88858984	122.39	55.57	51.01	0.68	75.00	10.08	54	11	1
42	2025-07-02 16:03:23.719	-2.18927777	-79.88761973	121.68	55.96	56.17	0.60	139.00	10.21	64	12	1
43	2025-07-02 16:03:33.721	-2.18836301	-79.88749354	121.97	53.65	56.71	0.69	319.00	10.60	43	11	1
44	2025-07-02 16:03:43.725	-2.18808538	-79.88736323	124.02	59.13	50.02	0.53	2.00	10.77	47	12	1
45	2025-07-02 16:03:53.731	-2.18909177	-79.88752788	124.14	57.50	55.80	0.57	197.00	10.90	68	11	1
46	2025-07-02 16:04:03.74	-2.18983997	-79.88755928	120.19	59.26	56.66	0.65	93.00	10.09	53	11	1
47	2025-07-02 16:04:13.749	-2.18934510	-79.88755451	127.67	52.24	57.12	0.51	21.00	10.98	57	12	1
48	2025-07-02 16:04:23.758	-2.18977463	-79.88721672	129.44	57.98	57.86	0.52	107.00	10.61	53	11	1
49	2025-07-02 16:04:33.756	-2.18963315	-79.88796324	121.33	54.97	54.53	0.66	155.00	10.14	45	11	1
50	2025-07-02 16:04:43.768	-2.18938785	-79.88764061	127.14	51.75	54.12	0.67	197.00	10.34	43	12	1
51	2025-07-02 16:04:53.781	-2.18984169	-79.88893771	124.27	52.28	55.67	0.69	211.00	10.82	36	11	1
52	2025-07-02 16:05:03.785	-2.18838950	-79.88886442	124.56	55.45	52.94	0.65	50.00	10.04	32	11	1
53	2025-07-02 16:05:13.797	-2.18932641	-79.88835979	129.85	58.80	56.73	0.62	266.00	10.11	41	12	1
54	2025-07-02 16:05:23.803	-2.18991082	-79.88789920	127.08	56.83	53.19	0.53	105.00	10.83	56	11	1
55	2025-07-02 16:05:33.804	-2.18972747	-79.88896489	121.80	54.67	54.99	0.61	303.00	10.63	38	10	1
56	2025-07-02 16:05:43.814	-2.18919593	-79.88705567	122.43	59.17	57.49	0.64	54.00	10.52	49	10	1
57	2025-07-02 16:05:53.825	-2.18957832	-79.88733262	127.38	57.65	58.41	0.61	295.00	10.14	37	10	1
58	2025-07-02 16:06:03.831	-2.18993806	-79.88733043	122.37	54.22	54.90	0.60	163.00	10.73	48	11	1
59	2025-07-02 16:06:13.841	-2.18947828	-79.88857133	122.86	51.98	52.34	0.64	170.00	10.25	66	11	1
60	2025-07-02 16:06:23.842	-2.18978814	-79.88712791	123.32	53.98	56.88	0.64	319.00	10.49	58	11	1
61	2025-07-02 16:06:33.853	-2.18888630	-79.88744725	126.46	58.97	50.88	0.52	2.00	10.07	54	11	1
62	2025-07-02 16:06:43.854	-2.18925439	-79.88759818	128.65	53.84	51.08	0.63	146.00	10.58	33	11	1
63	2025-07-02 16:06:53.865	-2.18908200	-79.88803667	129.19	57.19	53.55	0.64	139.00	10.46	68	10	1
64	2025-07-02 16:07:03.865	-2.18815969	-79.88796494	126.22	52.33	59.66	0.65	231.00	10.07	39	11	1
65	2025-07-02 16:07:13.874	-2.18935409	-79.88721603	127.76	54.25	59.49	0.60	275.00	10.92	69	12	1
66	2025-07-02 16:07:23.882	-2.18888069	-79.88845939	126.59	57.50	57.05	0.55	173.00	10.87	30	11	1
67	2025-07-02 16:07:33.916	-2.18875495	-79.88753782	120.12	50.90	50.82	0.57	89.00	10.58	63	12	1
68	2025-07-02 16:07:43.898	-2.18923450	-79.88752302	121.42	58.27	51.36	0.58	214.00	10.25	65	11	1
69	2025-07-02 16:07:53.92	-2.18840073	-79.88750267	121.22	58.88	59.48	0.65	15.00	10.99	35	10	1
70	2025-07-02 16:08:03.918	-2.18883250	-79.88783299	125.34	56.84	58.78	0.58	193.00	10.01	39	12	1
71	2025-07-02 16:08:13.925	-2.18980129	-79.88723842	121.47	55.98	59.16	0.69	294.00	10.53	43	10	1
72	2025-07-02 16:08:23.927	-2.18820323	-79.88720075	122.92	52.42	56.29	0.65	34.00	10.02	45	10	1
73	2025-07-02 16:08:33.934	-2.18889462	-79.88732864	127.55	51.83	54.99	0.68	175.00	10.04	65	11	1
74	2025-07-02 16:08:43.944	-2.18833334	-79.88795380	124.19	57.09	57.17	0.64	345.00	10.13	40	10	1
75	2025-07-02 16:08:53.963	-2.18921526	-79.88727712	124.86	55.11	56.51	0.64	209.00	10.87	37	10	1
76	2025-07-02 16:09:03.97	-2.18883563	-79.88741389	121.27	59.50	54.51	0.70	246.00	10.42	42	11	1
77	2025-07-02 16:09:13.988	-2.18936556	-79.88805401	122.35	57.26	53.96	0.61	248.00	10.51	50	12	1
78	2025-07-02 16:09:23.996	-2.18965426	-79.88855733	122.56	52.26	58.57	0.58	320.00	10.07	51	11	1
79	2025-07-02 16:09:34.002	-2.18838693	-79.88781709	127.38	51.94	52.33	0.51	105.00	10.44	69	10	1
80	2025-07-02 16:09:44.012	-2.18810529	-79.88845971	125.76	58.35	56.83	0.64	54.00	10.20	43	12	1
81	2025-07-02 16:09:54.016	-2.18819348	-79.88783084	124.15	54.06	52.12	0.61	37.00	10.12	39	10	1
82	2025-07-02 16:10:04.032	-2.18816489	-79.88784659	121.40	53.63	53.67	0.58	327.00	10.26	55	10	1
83	2025-07-02 16:10:14.034	-2.18813249	-79.88864495	124.27	56.87	54.96	0.53	120.00	10.08	47	11	1
84	2025-07-02 16:10:24.047	-2.18823353	-79.88728530	121.08	59.04	57.32	0.54	106.00	10.39	57	12	1
85	2025-07-02 16:10:34.062	-2.18948441	-79.88813074	122.32	57.44	58.64	0.51	226.00	10.67	58	10	1
86	2025-07-02 16:10:44.06	-2.18956870	-79.88753015	127.11	59.07	52.07	0.69	234.00	10.59	60	11	1
87	2025-07-02 16:10:54.073	-2.18893751	-79.88754107	129.79	56.85	54.70	0.63	351.00	10.82	39	11	1
88	2025-07-02 16:11:04.091	-2.18873545	-79.88715265	128.71	55.46	56.89	0.69	283.00	10.46	31	10	1
89	2025-07-02 16:11:14.089	-2.18975615	-79.88749268	125.44	50.99	53.78	0.61	102.00	10.93	44	10	1
90	2025-07-02 16:11:24.09	-2.18923032	-79.88849770	123.59	58.13	59.49	0.63	203.00	10.98	38	11	1
91	2025-07-02 16:11:34.097	-2.18877146	-79.88835728	124.59	53.05	50.57	0.53	274.00	10.62	34	11	1
92	2025-07-02 16:11:44.107	-2.18876657	-79.88835944	125.92	51.76	54.25	0.68	354.00	10.52	40	10	1
93	2025-07-02 16:11:54.12	-2.18880326	-79.88858745	128.02	57.28	57.51	0.59	105.00	10.75	58	10	1
94	2025-07-02 16:12:04.132	-2.18965262	-79.88828001	123.36	52.12	57.96	0.57	244.00	10.41	64	10	1
95	2025-07-02 16:12:14.14	-2.18960736	-79.88723753	128.98	50.69	58.75	0.63	11.00	10.96	38	10	1
96	2025-07-02 16:12:24.143	-2.18959869	-79.88803470	127.38	51.86	52.06	0.63	326.00	10.09	64	10	1
97	2025-07-02 16:12:34.143	-2.18874177	-79.88781891	122.80	51.18	53.32	0.56	147.00	10.76	69	12	1
98	2025-07-02 16:12:44.153	-2.18807627	-79.88714216	125.67	57.44	51.02	0.67	76.00	10.63	44	12	1
99	2025-07-02 16:12:54.161	-2.18876648	-79.88774749	126.63	58.64	59.57	0.64	318.00	10.48	31	12	1
100	2025-07-02 16:13:04.182	-2.18828291	-79.88786216	123.44	52.76	51.39	0.51	114.00	10.61	48	12	1
101	2025-07-02 16:13:14.176	-2.18972194	-79.88824864	121.38	50.80	59.60	0.60	258.00	10.13	62	12	1
102	2025-07-02 16:13:24.185	-2.18906025	-79.88798316	122.09	50.01	52.99	0.59	106.00	10.90	63	12	1
103	2025-07-02 16:13:44.21	-2.18919196	-79.88854955	122.35	56.49	55.21	0.58	328.00	10.46	35	12	1
104	2025-07-02 16:13:54.203	-2.18906164	-79.88880228	125.67	52.34	55.70	0.57	341.00	10.41	41	10	1
105	2025-07-02 16:14:04.725	-2.18917173	-79.88819972	123.60	56.97	58.57	0.68	150.00	10.37	37	11	1
106	2025-07-02 16:14:24.241	-2.18929881	-79.88896832	127.16	52.55	58.53	0.62	13.00	10.69	63	11	1
107	2025-07-02 16:14:34.245	-2.18876664	-79.88868901	123.48	59.62	50.09	0.62	216.00	10.87	62	11	1
108	2025-07-02 16:14:44.259	-2.18915699	-79.88899619	128.24	55.50	58.34	0.69	215.00	10.11	68	10	1
109	2025-07-02 16:14:54.259	-2.18870071	-79.88823563	126.48	54.56	51.66	0.61	260.00	10.56	39	11	1
110	2025-07-02 16:15:04.282	-2.18803869	-79.88740807	128.83	51.42	57.75	0.69	99.00	10.19	54	11	1
111	2025-07-02 16:15:14.298	-2.18892222	-79.88891024	129.85	56.67	50.89	0.51	84.00	10.35	55	11	1
112	2025-07-02 16:15:24.32	-2.18866227	-79.88825667	124.09	55.27	52.44	0.64	343.00	10.84	46	11	1
113	2025-07-02 16:15:34.306	-2.18915267	-79.88847717	125.12	52.74	53.86	0.60	216.00	10.17	41	12	1
114	2025-07-02 16:15:44.32	-2.18836144	-79.88798950	129.18	59.00	57.02	0.52	84.00	10.35	62	12	1
115	2025-07-02 16:15:54.325	-2.18814616	-79.88773428	128.61	53.36	50.55	0.60	37.00	10.63	65	10	1
116	2025-07-02 16:16:04.336	-2.18823731	-79.88709558	120.36	59.96	55.50	0.53	359.00	10.41	66	12	1
117	2025-07-02 16:16:14.35	-2.18953825	-79.88711729	123.01	58.00	52.06	0.51	32.00	10.95	57	12	1
118	2025-07-02 16:16:24.351	-2.18834413	-79.88861316	120.29	51.57	55.65	0.68	321.00	10.16	62	11	1
119	2025-07-02 16:16:34.361	-2.18824671	-79.88796995	122.43	57.89	54.06	0.62	273.00	10.76	30	12	1
120	2025-07-02 16:16:44.374	-2.18834534	-79.88834387	121.63	51.45	56.37	0.65	241.00	10.37	60	11	1
121	2025-07-02 16:16:54.371	-2.18943350	-79.88836625	125.42	57.06	57.10	0.60	6.00	10.39	67	11	1
122	2025-07-02 16:17:04.377	-2.18918376	-79.88893622	120.51	54.98	53.23	0.52	299.00	10.67	59	11	1
123	2025-07-02 16:17:14.377	-2.18804150	-79.88745374	123.47	52.26	54.56	0.64	27.00	10.14	47	10	1
124	2025-07-02 16:17:24.384	-2.18875231	-79.88879283	121.77	50.69	50.38	0.67	245.00	10.86	56	12	1
125	2025-07-02 16:17:34.394	-2.18944972	-79.88736118	126.70	55.30	50.17	0.52	267.00	10.19	54	10	1
126	2025-07-02 16:17:44.394	-2.18916752	-79.88846725	123.91	54.25	58.99	0.70	67.00	10.34	61	10	1
127	2025-07-02 16:17:54.401	-2.18921902	-79.88853512	129.59	50.23	51.56	0.57	335.00	10.09	39	11	1
128	2025-07-02 16:18:04.414	-2.18847846	-79.88772432	124.10	57.13	58.13	0.54	340.00	10.73	39	11	1
129	2025-07-02 16:18:14.423	-2.18886892	-79.88734618	129.07	59.39	52.17	0.51	336.00	10.89	62	10	1
130	2025-07-02 16:18:24.425	-2.18956819	-79.88717127	124.93	55.18	57.61	0.68	68.00	10.56	33	12	1
131	2025-07-02 16:18:34.435	-2.18920641	-79.88890326	127.32	56.24	50.89	0.63	254.00	10.54	45	10	1
132	2025-07-02 16:18:44.438	-2.18982080	-79.88724713	120.19	52.37	58.81	0.54	269.00	10.44	44	12	1
133	2025-07-02 16:18:54.45	-2.18859418	-79.88787051	121.85	51.98	51.21	0.65	179.00	10.50	49	10	1
134	2025-07-02 16:19:04.456	-2.18916478	-79.88751476	127.19	55.95	55.82	0.65	79.00	10.21	63	12	1
135	2025-07-02 16:19:14.457	-2.18863387	-79.88882178	122.08	56.17	55.99	0.70	263.00	10.02	66	12	1
136	2025-07-02 16:19:24.452	-2.18849451	-79.88845113	122.11	57.03	52.19	0.51	223.00	10.89	49	11	1
137	2025-07-02 16:19:34.468	-2.18942536	-79.88853735	124.62	59.40	59.06	0.57	84.00	10.70	49	11	1
138	2025-07-02 16:19:44.472	-2.18993137	-79.88799474	122.10	59.07	51.44	0.62	5.00	10.80	42	10	1
139	2025-07-02 16:19:54.476	-2.18871171	-79.88794761	124.51	50.51	52.91	0.54	141.00	10.07	45	12	1
140	2025-07-02 16:20:04.47	-2.18833231	-79.88896668	126.34	50.87	50.94	0.66	277.00	10.48	67	11	1
141	2025-07-02 16:20:14.484	-2.18989707	-79.88886909	120.17	52.39	51.53	0.68	318.00	10.81	68	12	1
142	2025-07-02 16:20:24.493	-2.18843491	-79.88811245	127.87	53.32	54.18	0.60	81.00	10.18	61	12	1
143	2025-07-02 16:20:34.513	-2.18816056	-79.88812898	125.20	55.99	52.36	0.62	269.00	10.70	61	12	1
144	2025-07-02 16:20:44.518	-2.18977899	-79.88739579	120.55	59.31	56.91	0.68	45.00	10.93	68	11	1
145	2025-07-02 16:20:54.527	-2.18965183	-79.88807007	120.48	58.95	59.67	0.56	163.00	10.05	49	11	1
146	2025-07-02 16:21:04.532	-2.18833268	-79.88822552	127.48	56.04	50.35	0.60	269.00	10.33	68	11	1
147	2025-07-02 16:21:14.539	-2.18905812	-79.88767500	124.12	58.38	54.09	0.53	192.00	10.67	55	10	1
148	2025-07-02 16:21:24.545	-2.18872042	-79.88815804	122.91	59.86	56.76	0.69	114.00	10.73	58	12	1
149	2025-07-02 16:21:34.553	-2.18960861	-79.88876077	123.05	54.81	56.90	0.52	133.00	10.85	40	11	1
150	2025-07-02 16:21:44.558	-2.18893574	-79.88848752	129.47	57.00	53.30	0.68	37.00	10.77	59	10	1
151	2025-07-02 16:21:54.568	-2.18915607	-79.88750224	121.20	50.04	55.34	0.61	194.00	10.15	39	11	1
152	2025-07-02 16:22:04.57	-2.18865490	-79.88748206	129.13	53.14	51.70	0.52	56.00	10.55	52	11	1
153	2025-07-02 16:22:14.583	-2.18944719	-79.88801875	123.90	59.67	53.49	0.66	159.00	10.38	69	10	1
154	2025-07-04 11:34:45.898	-2.18914578	-79.88703347	127.29	58.35	57.52	0.52	207.00	10.83	47	11	1
155	2025-07-04 11:34:55.864	-2.18851521	-79.88791272	126.92	53.31	56.26	0.59	98.00	10.18	30	11	1
156	2025-07-07 09:01:49.836	-2.18836932	-79.88708851	129.81	54.31	52.24	0.65	33.00	10.70	33	12	1
157	2025-07-07 09:08:07.26	-2.18953641	-79.88766678	127.60	58.52	58.71	0.67	348.00	10.56	64	12	1
158	2025-07-07 09:08:17.12	-2.18861621	-79.88877230	121.95	54.40	55.75	0.55	216.00	10.80	45	11	1
159	2025-07-07 09:08:27.08	-2.18907363	-79.88889330	123.66	51.83	50.60	0.55	358.00	10.83	64	11	1
160	2025-07-07 09:08:37.129	-2.18897602	-79.88753442	126.67	52.06	56.74	0.65	22.00	10.08	64	12	1
161	2025-07-07 09:10:00.151	-2.18880619	-79.88706980	122.07	57.79	51.34	0.54	212.00	10.00	34	10	1
162	2025-07-07 09:10:10.04	-2.18880428	-79.88776736	123.32	51.86	50.94	0.67	226.00	10.07	40	10	1
163	2025-07-09 11:31:26.687	-2.18844965	-79.88859002	128.86	57.49	53.73	0.67	302.00	10.54	35	10	1
164	2025-07-09 11:31:36.649	-2.18920590	-79.88713968	120.21	51.98	52.78	0.57	97.00	10.34	45	11	1
165	2025-07-09 11:31:37.064	-2.18890421	-79.88773684	120.76	54.09	54.08	0.58	337.00	10.51	55	11	1
166	2025-07-09 11:31:46.594	-2.18880668	-79.88744437	129.25	58.51	56.84	0.61	199.00	10.78	65	10	1
167	2025-07-09 11:31:46.984	-2.18942804	-79.88827973	126.64	52.37	57.38	0.57	201.00	10.31	38	10	1
168	2025-07-09 11:31:47.397	-2.18945128	-79.88769722	126.22	50.06	59.89	0.50	262.00	10.20	35	11	1
169	2025-07-09 11:31:47.401	-2.18923845	-79.88894612	120.84	53.13	52.34	0.50	191.00	10.01	49	10	1
170	2025-07-09 11:31:56.62	-2.18899591	-79.88704487	127.85	54.52	51.60	0.66	185.00	10.14	49	11	1
171	2025-07-09 11:31:56.984	-2.18945202	-79.88774002	126.98	54.57	58.64	0.62	276.00	10.16	50	10	1
172	2025-07-09 11:31:57.234	-2.18901396	-79.88873612	124.54	52.31	56.06	0.56	241.00	10.07	31	12	1
173	2025-07-09 11:31:57.324	-2.18970909	-79.88804744	123.96	51.59	50.01	0.59	185.00	10.14	43	11	1
174	2025-07-09 11:31:57.443	-2.18944256	-79.88756097	122.00	55.98	52.18	0.67	54.00	10.76	56	12	1
175	2025-07-09 11:31:57.715	-2.18836622	-79.88719172	123.48	57.68	51.26	0.67	228.00	10.67	69	10	1
176	2025-07-09 11:31:57.718	-2.18971179	-79.88709010	120.32	51.08	51.81	0.64	202.00	10.35	56	10	1
177	2025-07-09 11:31:57.769	-2.18951994	-79.88778145	122.22	53.14	50.05	0.67	8.00	11.00	49	12	1
178	2025-07-09 11:32:06.623	-2.18820699	-79.88756241	129.79	52.82	52.38	0.51	15.00	10.02	33	10	1
179	2025-07-09 11:32:06.954	-2.18945351	-79.88788353	127.16	58.01	52.37	0.53	132.00	10.47	67	10	1
180	2025-07-09 11:32:07.248	-2.18944517	-79.88846707	128.24	53.12	53.98	0.54	247.00	10.16	54	11	1
181	2025-07-09 11:32:07.303	-2.18808016	-79.88834550	127.92	54.38	50.37	0.62	94.00	10.85	36	11	1
182	2025-07-09 11:32:07.339	-2.18967394	-79.88795704	122.78	56.87	54.76	0.51	102.00	10.41	57	12	1
183	2025-07-09 11:32:07.425	-2.18987104	-79.88785389	125.63	51.09	58.11	0.65	270.00	10.74	47	12	1
184	2025-07-09 11:32:07.582	-2.18928890	-79.88724078	126.86	56.73	55.06	0.66	269.00	10.37	55	11	1
185	2025-07-09 11:32:07.633	-2.18845133	-79.88849051	129.80	56.65	55.00	0.56	235.00	10.65	36	10	1
186	2025-07-09 11:32:07.663	-2.18835092	-79.88866339	128.66	56.32	57.79	0.67	283.00	10.66	42	11	1
187	2025-07-09 11:32:07.712	-2.18938611	-79.88711405	129.01	51.05	57.99	0.50	98.00	10.18	49	12	1
188	2025-07-09 11:32:07.741	-2.18949373	-79.88790608	124.28	58.04	59.88	0.68	169.00	10.15	44	10	1
189	2025-07-09 11:32:07.755	-2.18917433	-79.88884092	124.10	54.40	54.13	0.61	256.00	10.56	46	10	1
190	2025-07-09 11:32:08.064	-2.18814148	-79.88713406	126.80	57.26	55.54	0.52	30.00	10.69	39	11	1
191	2025-07-09 11:32:08.077	-2.18925517	-79.88740159	121.84	58.87	52.47	0.62	83.00	10.54	36	12	1
192	2025-07-09 11:32:08.135	-2.18909839	-79.88786955	123.71	51.34	52.28	0.60	245.00	10.33	65	10	1
193	2025-07-09 11:32:08.138	-2.18801550	-79.88810020	129.64	52.82	58.08	0.65	273.00	10.26	53	10	1
\.


--
-- TOC entry 4992 (class 0 OID 0)
-- Dependencies: 229
-- Name: alertas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.alertas_id_seq', 1, false);


--
-- TOC entry 4993 (class 0 OID 0)
-- Dependencies: 221
-- Name: drones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.drones_id_seq', 1, true);


--
-- TOC entry 4994 (class 0 OID 0)
-- Dependencies: 225
-- Name: historial_vuelos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historial_vuelos_id_seq', 1, false);


--
-- TOC entry 4995 (class 0 OID 0)
-- Dependencies: 217
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 2, true);


--
-- TOC entry 4996 (class 0 OID 0)
-- Dependencies: 227
-- Name: terminologia_alertas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.terminologia_alertas_id_seq', 1, false);


--
-- TOC entry 4997 (class 0 OID 0)
-- Dependencies: 219
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 3, true);


--
-- TOC entry 4998 (class 0 OID 0)
-- Dependencies: 231
-- Name: videos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.videos_id_seq', 1, false);


--
-- TOC entry 4999 (class 0 OID 0)
-- Dependencies: 223
-- Name: vuelos_bruto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vuelos_bruto_id_seq', 193, true);


--
-- TOC entry 4807 (class 2606 OID 16532)
-- Name: alertas alertas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alertas
    ADD CONSTRAINT alertas_pkey PRIMARY KEY (id);


--
-- TOC entry 4797 (class 2606 OID 16479)
-- Name: drones drones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drones
    ADD CONSTRAINT drones_pkey PRIMARY KEY (id);


--
-- TOC entry 4799 (class 2606 OID 16481)
-- Name: drones drones_serial_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drones
    ADD CONSTRAINT drones_serial_number_key UNIQUE (serial_number);


--
-- TOC entry 4803 (class 2606 OID 16501)
-- Name: historial_vuelos historial_vuelos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_vuelos
    ADD CONSTRAINT historial_vuelos_pkey PRIMARY KEY (id);


--
-- TOC entry 4791 (class 2606 OID 16457)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 4805 (class 2606 OID 16521)
-- Name: terminologia_alertas terminologia_alertas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.terminologia_alertas
    ADD CONSTRAINT terminologia_alertas_pkey PRIMARY KEY (id);


--
-- TOC entry 4793 (class 2606 OID 16466)
-- Name: usuarios usuarios_correo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_correo_key UNIQUE (correo);


--
-- TOC entry 4795 (class 2606 OID 16464)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4809 (class 2606 OID 16549)
-- Name: videos videos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT videos_pkey PRIMARY KEY (id);


--
-- TOC entry 4801 (class 2606 OID 16493)
-- Name: vuelos_bruto vuelos_bruto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vuelos_bruto
    ADD CONSTRAINT vuelos_bruto_pkey PRIMARY KEY (id);


--
-- TOC entry 4815 (class 2606 OID 16533)
-- Name: alertas alertas_historial_vuelo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alertas
    ADD CONSTRAINT alertas_historial_vuelo_id_fkey FOREIGN KEY (historial_vuelo_id) REFERENCES public.historial_vuelos(id);


--
-- TOC entry 4816 (class 2606 OID 16538)
-- Name: alertas alertas_termino_alerta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alertas
    ADD CONSTRAINT alertas_termino_alerta_id_fkey FOREIGN KEY (termino_alerta_id) REFERENCES public.terminologia_alertas(id);


--
-- TOC entry 4811 (class 2606 OID 16482)
-- Name: drones drones_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drones
    ADD CONSTRAINT drones_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- TOC entry 4812 (class 2606 OID 24643)
-- Name: vuelos_bruto fk_dron_vuelo; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vuelos_bruto
    ADD CONSTRAINT fk_dron_vuelo FOREIGN KEY (dron_id) REFERENCES public.drones(id);


--
-- TOC entry 4813 (class 2606 OID 16502)
-- Name: historial_vuelos historial_vuelos_dron_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_vuelos
    ADD CONSTRAINT historial_vuelos_dron_id_fkey FOREIGN KEY (dron_id) REFERENCES public.drones(id);


--
-- TOC entry 4814 (class 2606 OID 16507)
-- Name: historial_vuelos historial_vuelos_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_vuelos
    ADD CONSTRAINT historial_vuelos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id);


--
-- TOC entry 4810 (class 2606 OID 16467)
-- Name: usuarios usuarios_rol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.roles(id);


--
-- TOC entry 4817 (class 2606 OID 16550)
-- Name: videos videos_historial_vuelo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT videos_historial_vuelo_id_fkey FOREIGN KEY (historial_vuelo_id) REFERENCES public.historial_vuelos(id);


-- Completed on 2025-07-30 14:44:03

--
-- PostgreSQL database dump complete
--

