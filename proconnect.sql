--
-- PostgreSQL database dump
--

\restrict 2u0M24Lc3h2wJ1KBBwURQLhacC1Wbl04bB75YiEKoy8eBeHmJkmbaSeAxCuaU8c

-- Dumped from database version 16.13 (Debian 16.13-1.pgdg13+1)
-- Dumped by pg_dump version 16.13 (Debian 16.13-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: notification_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.notification_type_enum AS ENUM (
    'RESERVATION_CREATED',
    'RESERVATION_UPDATED',
    'RESERVATION_CANCELLED',
    'APPOINTMENT_REMINDER',
    'NEW_CHAT_MESSAGE'
);


ALTER TYPE public.notification_type_enum OWNER TO postgres;

--
-- Name: reservation_mode_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.reservation_mode_enum AS ENUM (
    'ONLINE',
    'IN_PERSON'
);


ALTER TYPE public.reservation_mode_enum OWNER TO postgres;

--
-- Name: reservation_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.reservation_status_enum AS ENUM (
    'PENDING',
    'CONFIRMED',
    'CANCELLED',
    'COMPLETED'
);


ALTER TYPE public.reservation_status_enum OWNER TO postgres;

--
-- Name: service_mode_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.service_mode_enum AS ENUM (
    'ONLINE',
    'IN_PERSON'
);


ALTER TYPE public.service_mode_enum OWNER TO postgres;

--
-- Name: user_role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role_enum AS ENUM (
    'USER',
    'PROFESSIONAL'
);


ALTER TYPE public.user_role_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: availability_slot; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.availability_slot (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "professionalId" uuid NOT NULL,
    "startAt" timestamp without time zone NOT NULL,
    "endAt" timestamp without time zone NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.availability_slot OWNER TO postgres;

--
-- Name: chat_conversation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_conversation (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "reservationId" uuid NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.chat_conversation OWNER TO postgres;

--
-- Name: chat_message; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_message (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "conversationId" uuid NOT NULL,
    "senderId" uuid NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.chat_message OWNER TO postgres;

--
-- Name: invoice; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoice (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "reservationId" uuid NOT NULL,
    "professionalId" uuid NOT NULL,
    total numeric(10,2) NOT NULL,
    "issuedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.invoice OWNER TO postgres;

--
-- Name: notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "userId" uuid NOT NULL,
    type public.notification_type_enum NOT NULL,
    channel character varying NOT NULL,
    title character varying NOT NULL,
    message character varying NOT NULL,
    "readAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.notification OWNER TO postgres;

--
-- Name: notificaciones_es; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.notificaciones_es AS
 SELECT id,
    "userId" AS usuario_id,
        CASE
            WHEN (type = 'RESERVATION_CREATED'::public.notification_type_enum) THEN 'RESERVA_CREADA'::text
            WHEN (type = 'RESERVATION_UPDATED'::public.notification_type_enum) THEN 'RESERVA_ACTUALIZADA'::text
            WHEN (type = 'RESERVATION_CANCELLED'::public.notification_type_enum) THEN 'RESERVA_CANCELADA'::text
            WHEN (type = 'APPOINTMENT_REMINDER'::public.notification_type_enum) THEN 'RECORDATORIO_CITA'::text
            WHEN (type = 'NEW_CHAT_MESSAGE'::public.notification_type_enum) THEN 'NUEVO_MENSAJE_CHAT'::text
            ELSE (type)::text
        END AS tipo,
    channel AS canal,
    title AS titulo,
    message AS mensaje,
    "readAt" AS leida_en,
    "createdAt" AS creada_en
   FROM public.notification n;


ALTER VIEW public.notificaciones_es OWNER TO postgres;

--
-- Name: professional_profile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.professional_profile (
    id uuid NOT NULL,
    "userId" uuid NOT NULL,
    specialty character varying NOT NULL,
    experience integer NOT NULL,
    description text NOT NULL,
    "contactInfo" character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.professional_profile OWNER TO postgres;

--
-- Name: reservation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservation (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "userId" uuid NOT NULL,
    "professionalId" uuid NOT NULL,
    "serviceId" uuid NOT NULL,
    mode public.reservation_mode_enum NOT NULL,
    "scheduledAt" timestamp without time zone NOT NULL,
    status public.reservation_status_enum DEFAULT 'PENDING'::public.reservation_status_enum NOT NULL,
    "onlineLink" character varying,
    "travelAddress" character varying,
    "travelCost" numeric(10,2),
    "proposedPrice" numeric(10,2),
    "negotiationMessage" text,
    "counterOfferPrice" numeric(10,2),
    "counterOfferMessage" text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.reservation OWNER TO postgres;

--
-- Name: reservas_es; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.reservas_es AS
 SELECT id,
    "userId" AS usuario_id,
    "professionalId" AS profesional_id,
    "serviceId" AS servicio_id,
        CASE
            WHEN (mode = 'ONLINE'::public.reservation_mode_enum) THEN 'EN LINEA'::text
            WHEN (mode = 'IN_PERSON'::public.reservation_mode_enum) THEN 'PRESENCIAL'::text
            ELSE (mode)::text
        END AS modalidad,
    "scheduledAt" AS fecha_programada,
        CASE
            WHEN (status = 'PENDING'::public.reservation_status_enum) THEN 'PENDIENTE'::text
            WHEN (status = 'CONFIRMED'::public.reservation_status_enum) THEN 'CONFIRMADA'::text
            WHEN (status = 'CANCELLED'::public.reservation_status_enum) THEN 'CANCELADA'::text
            WHEN (status = 'COMPLETED'::public.reservation_status_enum) THEN 'COMPLETADA'::text
            ELSE (status)::text
        END AS estado,
    "onlineLink" AS enlace_en_linea,
    "travelAddress" AS direccion_desplazamiento,
    "travelCost" AS costo_desplazamiento,
    "proposedPrice" AS precio_propuesto,
    "negotiationMessage" AS mensaje_negociacion,
    "counterOfferPrice" AS precio_contraoferta,
    "counterOfferMessage" AS mensaje_contraoferta,
    "createdAt" AS creado_en,
    "updatedAt" AS actualizado_en
   FROM public.reservation r;


ALTER VIEW public.reservas_es OWNER TO postgres;

--
-- Name: review; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.review (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "professionalId" uuid NOT NULL,
    "userId" uuid NOT NULL,
    rating integer NOT NULL,
    comment text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.review OWNER TO postgres;

--
-- Name: service; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.service (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "professionalId" uuid NOT NULL,
    name character varying NOT NULL,
    price numeric(10,2) NOT NULL,
    mode public.service_mode_enum NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.service OWNER TO postgres;

--
-- Name: servicios_es; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.servicios_es AS
 SELECT id,
    "professionalId" AS profesional_id,
    name AS nombre_servicio,
    price AS precio,
        CASE
            WHEN (mode = 'ONLINE'::public.service_mode_enum) THEN 'EN LINEA'::text
            WHEN (mode = 'IN_PERSON'::public.service_mode_enum) THEN 'PRESENCIAL'::text
            ELSE (mode)::text
        END AS modalidad,
    "createdAt" AS creado_en,
    "updatedAt" AS actualizado_en
   FROM public.service s;


ALTER VIEW public.servicios_es OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "fullName" character varying NOT NULL,
    email character varying NOT NULL,
    "passwordHash" text,
    "birthDate" date,
    "nationalId" text,
    phone text,
    "passwordRecoveryCode" text,
    "passwordRecoveryCodeExpiresAt" timestamp without time zone,
    role public.user_role_enum DEFAULT 'USER'::public.user_role_enum NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: usuarios_es; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.usuarios_es AS
 SELECT id,
    "fullName" AS nombre_completo,
    email AS correo,
        CASE
            WHEN (role = 'USER'::public.user_role_enum) THEN 'USUARIO'::text
            WHEN (role = 'PROFESSIONAL'::public.user_role_enum) THEN 'PROFESIONAL'::text
            ELSE (role)::text
        END AS rol,
    "birthDate" AS fecha_nacimiento,
    "nationalId" AS documento,
    phone AS telefono,
    "createdAt" AS creado_en,
    "updatedAt" AS actualizado_en
   FROM public."user" u;


ALTER VIEW public.usuarios_es OWNER TO postgres;

--
-- Data for Name: availability_slot; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.availability_slot (id, "professionalId", "startAt", "endAt", "createdAt") FROM stdin;
e36352bf-70c8-4ad1-92ca-8e8f36b1555b	c09016b3-8056-4f31-a897-7b45d620cf2c	2026-03-25 21:00:33.805	2026-03-25 22:00:33.805	2026-03-24 02:00:33.848757
91c9c8cf-3ca6-4d2a-8bba-60b1a946f271	1ecdad83-41f4-45b9-9b0b-d838f23defca	2026-03-26 21:00:33.805	2026-03-26 22:30:33.805	2026-03-24 02:00:33.848757
\.


--
-- Data for Name: chat_conversation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_conversation (id, "reservationId", "createdAt") FROM stdin;
f6caf428-5597-4d7c-8fea-0959c46c3543	8248b85e-f8bd-4a2d-a669-983949a4f3e2	2026-03-24 02:00:33.869427
63283b16-b086-442a-b241-8c055d2faf62	9ba070bb-60b9-4e73-b6b1-32ee01f6947a	2026-03-24 02:00:33.869427
\.


--
-- Data for Name: chat_message; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_message (id, "conversationId", "senderId", content, "createdAt") FROM stdin;
c9f9cfd4-2423-4576-b466-d5680066c530	f6caf428-5597-4d7c-8fea-0959c46c3543	c4aa4740-dc45-42c8-9d0f-e85d7ae39d8e	Hola Maria, te envie una propuesta de precio para iniciar rapido.	2026-03-24 02:00:33.879549
da60e1e8-12d2-4a3f-aba1-dddbf323a2ab	f6caf428-5597-4d7c-8fea-0959c46c3543	c09016b3-8056-4f31-a897-7b45d620cf2c	Perfecto Ana, te deje una contraoferta con alcance ajustado.	2026-03-24 02:00:33.879549
decbeb2d-ac35-4212-b686-8dd111984940	63283b16-b086-442a-b241-8c055d2faf62	8e268d71-36d2-45f4-afa9-b27613f58399	Juan, ya quedo confirmada la sesion presencial del jueves.	2026-03-24 02:00:33.879549
\.


--
-- Data for Name: invoice; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoice (id, "reservationId", "professionalId", total, "issuedAt") FROM stdin;
6fe797cd-8da5-4ed3-a77f-ab37ae8bc80d	3e3d2d0a-0112-4769-a0a1-fcd27b2e717e	fc2a212e-64dc-4808-aa1e-33f94e79e50e	120000.00	2026-03-24 02:00:33.899223
\.


--
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification (id, "userId", type, channel, title, message, "readAt", "createdAt") FROM stdin;
58f70b6b-fdbb-4881-aa46-79197b941146	c09016b3-8056-4f31-a897-7b45d620cf2c	RESERVATION_CREATED	IN_APP	Nueva solicitud con negociacion	Ana Torres envio una nueva solicitud con oferta inicial.	\N	2026-03-24 02:00:33.908198
7807489e-657b-44ec-958b-01c8928dc076	1ecdad83-41f4-45b9-9b0b-d838f23defca	NEW_CHAT_MESSAGE	IN_APP	Nuevo mensaje de Carlos	Carlos Mejia te escribio en la reserva confirmada.	\N	2026-03-24 02:00:33.908198
0cb19798-318a-4965-8296-50295fe921bb	8e268d71-36d2-45f4-afa9-b27613f58399	RESERVATION_UPDATED	IN_APP	Reserva confirmada	Tu reserva con Juan Perez fue confirmada.	2026-03-23 21:00:33.864	2026-03-24 02:00:33.908198
d025d5d1-a1d8-44ea-98b0-6a5e63bdf553	c4aa4740-dc45-42c8-9d0f-e85d7ae39d8e	RESERVATION_UPDATED	IN_APP	Recibiste una contraoferta	Maria Rojas envio una contraoferta en tu reserva.	2026-03-23 21:04:54.186	2026-03-24 02:00:33.908198
588554d0-858b-4025-ba88-61974df16fd4	c4aa4740-dc45-42c8-9d0f-e85d7ae39d8e	RESERVATION_CREATED	EMAIL	Reserva creada	Tu reserva fue creada exitosamente.	\N	2026-03-24 02:06:06.658874
61b8b7f3-c3c1-41d4-b4a9-bcd4d6801329	fc2a212e-64dc-4808-aa1e-33f94e79e50e	RESERVATION_CREATED	EMAIL	Reserva creada	Tu reserva fue creada exitosamente.	\N	2026-03-24 02:06:06.658874
07e85b28-be7d-4770-ba9c-94ccf609979a	c4aa4740-dc45-42c8-9d0f-e85d7ae39d8e	RESERVATION_UPDATED	EMAIL	Reserva modificada	Tu reserva cambió de fecha u hora.	\N	2026-03-24 02:09:11.63204
cac72c7c-df04-4d9e-a698-72d38a4d4612	fc2a212e-64dc-4808-aa1e-33f94e79e50e	RESERVATION_UPDATED	EMAIL	Reserva modificada	Tu reserva cambió de fecha u hora.	2026-03-23 21:09:36.243	2026-03-24 02:09:11.63204
\.


--
-- Data for Name: professional_profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.professional_profile (id, "userId", specialty, experience, description, "contactInfo", "createdAt", "updatedAt") FROM stdin;
c09016b3-8056-4f31-a897-7b45d620cf2c	c09016b3-8056-4f31-a897-7b45d620cf2c	Desarrollo Web Fullstack	7	Implemento plataformas web con NestJS, React y PostgreSQL, incluyendo CI/CD.	Disponible para proyectos remotos y mentoring tecnico.	2026-03-24 02:00:33.828608	2026-03-24 02:00:33.828608
1ecdad83-41f4-45b9-9b0b-d838f23defca	1ecdad83-41f4-45b9-9b0b-d838f23defca	Diseno UX/UI y Branding	6	Ayudo a equipos a convertir ideas en productos intuitivos con foco en conversion.	Atencion en linea de lunes a sabado.	2026-03-24 02:00:33.828608	2026-03-24 02:00:33.828608
fc2a212e-64dc-4808-aa1e-33f94e79e50e	fc2a212e-64dc-4808-aa1e-33f94e79e50e	Coaching de carrera TI	5	Simulacros de entrevistas tecnicas, mejora de CV y estrategia profesional.	Sesiones virtuales de 60 y 90 minutos.	2026-03-24 02:00:33.828608	2026-03-24 02:00:33.828608
\.


--
-- Data for Name: reservation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reservation (id, "userId", "professionalId", "serviceId", mode, "scheduledAt", status, "onlineLink", "travelAddress", "travelCost", "proposedPrice", "negotiationMessage", "counterOfferPrice", "counterOfferMessage", "createdAt", "updatedAt") FROM stdin;
8248b85e-f8bd-4a2d-a669-983949a4f3e2	c4aa4740-dc45-42c8-9d0f-e85d7ae39d8e	c09016b3-8056-4f31-a897-7b45d620cf2c	350f5a16-c237-4c96-8317-e0e1bf2690a0	ONLINE	2026-03-25 21:00:33.814	PENDING	https://meet.jit.si/proconnect-negociacion-ana-maria	\N	\N	200000.00	Podemos ajustar el alcance para un presupuesto de 200k?	220000.00	Puedo incluir entregable reducido y 1 reunion de seguimiento.	2026-03-24 02:00:33.858107	2026-03-24 02:00:33.858107
9ba070bb-60b9-4e73-b6b1-32ee01f6947a	8e268d71-36d2-45f4-afa9-b27613f58399	1ecdad83-41f4-45b9-9b0b-d838f23defca	00fe82c6-a4ea-47f7-a8b1-cb5ac0c67eba	IN_PERSON	2026-03-27 21:00:33.814	CONFIRMED	\N	Calle 85 #13-50, Bogota	25000.00	\N	\N	\N	\N	2026-03-24 02:00:33.858107	2026-03-24 02:00:33.858107
3e3d2d0a-0112-4769-a0a1-fcd27b2e717e	c4aa4740-dc45-42c8-9d0f-e85d7ae39d8e	fc2a212e-64dc-4808-aa1e-33f94e79e50e	30d07eee-c569-46c5-bccd-88109a49edb2	ONLINE	2026-03-18 21:00:33.814	COMPLETED	https://meet.jit.si/proconnect-coaching-ana-laura	\N	\N	\N	\N	\N	\N	2026-03-24 02:00:33.858107	2026-03-24 02:00:33.858107
a88b6d9e-9d05-4e92-865b-2c60cb31e838	c4aa4740-dc45-42c8-9d0f-e85d7ae39d8e	fc2a212e-64dc-4808-aa1e-33f94e79e50e	30d07eee-c569-46c5-bccd-88109a49edb2	ONLINE	2026-03-03 15:02:00	CANCELLED	https://meet.jit.si/proconnect-fc2a212e-1774317966577	\N	\N	\N	\N	\N	\N	2026-03-24 02:06:06.63648	2026-03-24 02:09:11.621338
\.


--
-- Data for Name: review; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.review (id, "professionalId", "userId", rating, comment, "createdAt") FROM stdin;
185a8d98-9f9a-4bce-b74e-c0312f8bf0d7	fc2a212e-64dc-4808-aa1e-33f94e79e50e	c4aa4740-dc45-42c8-9d0f-e85d7ae39d8e	5	Excelente sesion, me ayudo a mejorar mi presentacion tecnica.	2026-03-24 02:00:33.889121
\.


--
-- Data for Name: service; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.service (id, "professionalId", name, price, mode, "createdAt", "updatedAt") FROM stdin;
350f5a16-c237-4c96-8317-e0e1bf2690a0	c09016b3-8056-4f31-a897-7b45d620cf2c	Auditoria tecnica de arquitectura	240000.00	ONLINE	2026-03-24 02:00:33.8391	2026-03-24 02:00:33.8391
1ae08ae3-c680-4bcb-a91c-4d049f7f82a5	c09016b3-8056-4f31-a897-7b45d620cf2c	Mentoria Fullstack por sprint	180000.00	ONLINE	2026-03-24 02:00:33.8391	2026-03-24 02:00:33.8391
00fe82c6-a4ea-47f7-a8b1-cb5ac0c67eba	1ecdad83-41f4-45b9-9b0b-d838f23defca	Revision UX completa de producto	210000.00	IN_PERSON	2026-03-24 02:00:33.8391	2026-03-24 02:00:33.8391
30d07eee-c569-46c5-bccd-88109a49edb2	fc2a212e-64dc-4808-aa1e-33f94e79e50e	Coaching de entrevista tecnica	120000.00	ONLINE	2026-03-24 02:00:33.8391	2026-03-24 02:00:33.8391
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, "fullName", email, "passwordHash", "birthDate", "nationalId", phone, "passwordRecoveryCode", "passwordRecoveryCodeExpiresAt", role, "createdAt", "updatedAt") FROM stdin;
c4aa4740-dc45-42c8-9d0f-e85d7ae39d8e	Ana Torres	ana.user@proconnect.dev	$2b$10$wCtR0nIH7zaKtrvxFBvX..6y83W7UMNTCzM1zPWgvKPCo3mx9z4ri	1996-03-11	CC-1001001001	+57 310 111 2233	\N	\N	USER	2026-03-24 02:00:33.788743	2026-03-24 02:00:33.788743
8e268d71-36d2-45f4-afa9-b27613f58399	Carlos Mejia	carlos.user@proconnect.dev	$2b$10$wCtR0nIH7zaKtrvxFBvX..6y83W7UMNTCzM1zPWgvKPCo3mx9z4ri	1993-11-03	CC-1002002002	+57 310 222 3344	\N	\N	USER	2026-03-24 02:00:33.788743	2026-03-24 02:00:33.788743
c09016b3-8056-4f31-a897-7b45d620cf2c	Maria Rojas	maria.pro@proconnect.dev	$2b$10$wCtR0nIH7zaKtrvxFBvX..6y83W7UMNTCzM1zPWgvKPCo3mx9z4ri	1990-09-20	CC-2001001001	+57 320 333 4455	\N	\N	PROFESSIONAL	2026-03-24 02:00:33.788743	2026-03-24 02:00:33.788743
1ecdad83-41f4-45b9-9b0b-d838f23defca	Juan Perez	juan.pro@proconnect.dev	$2b$10$wCtR0nIH7zaKtrvxFBvX..6y83W7UMNTCzM1zPWgvKPCo3mx9z4ri	1988-07-02	CC-2002002002	+57 320 444 5566	\N	\N	PROFESSIONAL	2026-03-24 02:00:33.788743	2026-03-24 02:00:33.788743
fc2a212e-64dc-4808-aa1e-33f94e79e50e	Laura Gomez	laura.pro@proconnect.dev	$2b$10$wCtR0nIH7zaKtrvxFBvX..6y83W7UMNTCzM1zPWgvKPCo3mx9z4ri	1992-05-14	CC-2003003003	+57 320 555 6677	\N	\N	PROFESSIONAL	2026-03-24 02:00:33.788743	2026-03-24 02:00:33.788743
\.


--
-- Name: chat_conversation PK_0c5b7697e69f674eb983b1e83cc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_conversation
    ADD CONSTRAINT "PK_0c5b7697e69f674eb983b1e83cc" PRIMARY KEY (id);


--
-- Name: invoice PK_15d25c200d9bcd8a33f698daf18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice
    ADD CONSTRAINT "PK_15d25c200d9bcd8a33f698daf18" PRIMARY KEY (id);


--
-- Name: professional_profile PK_1ce3d6cad9c742bf11d71879f5b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professional_profile
    ADD CONSTRAINT "PK_1ce3d6cad9c742bf11d71879f5b" PRIMARY KEY (id);


--
-- Name: review PK_2e4299a343a81574217255c00ca; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY (id);


--
-- Name: chat_message PK_3cc0d85193aade457d3077dd06b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_message
    ADD CONSTRAINT "PK_3cc0d85193aade457d3077dd06b" PRIMARY KEY (id);


--
-- Name: reservation PK_48b1f9922368359ab88e8bfa525; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT "PK_48b1f9922368359ab88e8bfa525" PRIMARY KEY (id);


--
-- Name: availability_slot PK_62a782c29fd83da5ba7c4ea55f7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.availability_slot
    ADD CONSTRAINT "PK_62a782c29fd83da5ba7c4ea55f7" PRIMARY KEY (id);


--
-- Name: notification PK_705b6c7cdf9b2c2ff7ac7872cb7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY (id);


--
-- Name: service PK_85a21558c006647cd76fdce044b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service
    ADD CONSTRAINT "PK_85a21558c006647cd76fdce044b" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: professional_profile UQ_298957b242ee4fe42dc68dfcc3c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professional_profile
    ADD CONSTRAINT "UQ_298957b242ee4fe42dc68dfcc3c" UNIQUE ("userId");


--
-- Name: user UQ_5e30ae7136bce1f6d80d9c0b72d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_5e30ae7136bce1f6d80d9c0b72d" UNIQUE ("nationalId");


--
-- Name: chat_conversation UQ_626da22cc1d1bddb3c9e04cf634; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_conversation
    ADD CONSTRAINT "UQ_626da22cc1d1bddb3c9e04cf634" UNIQUE ("reservationId");


--
-- Name: invoice UQ_dc9c6a4d521286fd1acb6677879; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice
    ADD CONSTRAINT "UQ_dc9c6a4d521286fd1acb6677879" UNIQUE ("reservationId");


--
-- Name: user UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);


--
-- Name: IDX_a9eaf8f0b08c0d3d840d8fc2a8; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_a9eaf8f0b08c0d3d840d8fc2a8" ON public.reservation USING btree ("professionalId", "scheduledAt");


--
-- Name: reservation FK_0180e58c9266df567fe8161947c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT "FK_0180e58c9266df567fe8161947c" FOREIGN KEY ("serviceId") REFERENCES public.service(id) ON DELETE RESTRICT;


--
-- Name: review FK_1337f93918c70837d3cea105d39; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT "FK_1337f93918c70837d3cea105d39" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: notification FK_1ced25315eb974b73391fb1c81b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT "FK_1ced25315eb974b73391fb1c81b" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: professional_profile FK_298957b242ee4fe42dc68dfcc3c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professional_profile
    ADD CONSTRAINT "FK_298957b242ee4fe42dc68dfcc3c" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: reservation FK_35449cc17c7af07898f8cdb11ff; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT "FK_35449cc17c7af07898f8cdb11ff" FOREIGN KEY ("professionalId") REFERENCES public.professional_profile(id) ON DELETE CASCADE;


--
-- Name: reservation FK_529dceb01ef681127fef04d755d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT "FK_529dceb01ef681127fef04d755d" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: chat_conversation FK_626da22cc1d1bddb3c9e04cf634; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_conversation
    ADD CONSTRAINT "FK_626da22cc1d1bddb3c9e04cf634" FOREIGN KEY ("reservationId") REFERENCES public.reservation(id);


--
-- Name: chat_message FK_71d77a16df3f16e830d645f31f6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_message
    ADD CONSTRAINT "FK_71d77a16df3f16e830d645f31f6" FOREIGN KEY ("conversationId") REFERENCES public.chat_conversation(id) ON DELETE CASCADE;


--
-- Name: service FK_8bd980105c9c0603e783af43d9f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service
    ADD CONSTRAINT "FK_8bd980105c9c0603e783af43d9f" FOREIGN KEY ("professionalId") REFERENCES public.professional_profile(id) ON DELETE CASCADE;


--
-- Name: review FK_9083b604c7d889d602915d63582; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT "FK_9083b604c7d889d602915d63582" FOREIGN KEY ("professionalId") REFERENCES public.professional_profile(id) ON DELETE CASCADE;


--
-- Name: availability_slot FK_96f155e761df2102d168bee5c95; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.availability_slot
    ADD CONSTRAINT "FK_96f155e761df2102d168bee5c95" FOREIGN KEY ("professionalId") REFERENCES public.professional_profile(id) ON DELETE CASCADE;


--
-- Name: chat_message FK_a2be22c99b34156574f4e02d0a0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_message
    ADD CONSTRAINT "FK_a2be22c99b34156574f4e02d0a0" FOREIGN KEY ("senderId") REFERENCES public."user"(id);


--
-- Name: invoice FK_c58a9584e497241200b97c35d8e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice
    ADD CONSTRAINT "FK_c58a9584e497241200b97c35d8e" FOREIGN KEY ("professionalId") REFERENCES public.professional_profile(id);


--
-- Name: invoice FK_dc9c6a4d521286fd1acb6677879; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoice
    ADD CONSTRAINT "FK_dc9c6a4d521286fd1acb6677879" FOREIGN KEY ("reservationId") REFERENCES public.reservation(id);


--
-- PostgreSQL database dump complete
--

\unrestrict 2u0M24Lc3h2wJ1KBBwURQLhacC1Wbl04bB75YiEKoy8eBeHmJkmbaSeAxCuaU8c

