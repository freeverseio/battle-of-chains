CREATE EXTENSION IF NOT EXISTS citext;

-- DROP TABLE public.chain;

CREATE TABLE public.chain (
	chain_id int4 NOT NULL,
	name text NOT NULL,
	score int8 NOT NULL,
	CONSTRAINT chain_pkey PRIMARY KEY (chain_id)
);

-- DROP TABLE public.chain_action_proposals;

CREATE TABLE public.chain_action_proposal (
	proposal_hash text NOT NULL,
	source_chain_id int4 NOT NULL,
	target_chain_id int4,
	type int4 NOT NULL,
	attack_area int4,
	attack_address CITEXT,
	votes int8 NOT NULL,
	CONSTRAINT chain_action_proposal_pkey PRIMARY KEY (proposal_hash),
	CONSTRAINT source_chain_id_fkey FOREIGN KEY (source_chain_id) REFERENCES public.chain(chain_id),
	CONSTRAINT target_chain_id_fkey FOREIGN KEY (target_chain_id) REFERENCES public.chain(chain_id)
);

-- DROP TABLE public.user;

CREATE TABLE public.user (
	address CITEXT NOT NULL,
	name text,
	homechain int4,
	mercenary_chain int4,
	joined_timestamp int8,
	score int8 NOT NULL,
	treasury int8 NOT NULL,
	health int8 NOT NULL,
	xp int8 NOT NULL,
	level int8 NOT NULL,
	treasury_last_update int8 NOT NULL,
	current_supported_chain_action text,
	CONSTRAINT user_pkey PRIMARY KEY (address),
	CONSTRAINT user_homechain_fkey FOREIGN KEY (homechain) REFERENCES public.chain(chain_id),
	CONSTRAINT user_mercenary_chain_fkey FOREIGN KEY (mercenary_chain) REFERENCES public.chain(chain_id),
	CONSTRAINT current_supported_chain_action_fkey FOREIGN KEY (current_supported_chain_action) REFERENCES public.chain_action_proposal(proposal_hash)
);

-- DROP TABLE public.log;

CREATE TABLE public.log (
    id SERIAL PRIMARY KEY,
	user_address CITEXT,
	chain int4,
	timestamp int8 NOT NULL,
	comment text NOT NULL,
	CONSTRAINT user_fkey FOREIGN KEY (user_address) REFERENCES public.user(address),
	CONSTRAINT chain_fkey FOREIGN KEY (chain) REFERENCES public.chain(chain_id)
);

CREATE TYPE asset_state AS ENUM ('FREE', 'ATTACKING');

-- DROP TABLE public.asset;

CREATE TABLE public.asset (
	chain_id int4 NOT NULL,
	token_id text NOT NULL,
	type text NOT NULL,
	creation_timestamp int8,
	owner CITEXT NOT NULL,
	xp int8,
	health int8,
	level int8,
	attack int8,
	defense int8,
	age int8,
	travel_speed int8,
	potential int8,
	species int8,
	stats_last_update int8 NOT NULL,
	asset_state int8 NOT NULL,
	pending_attack_id int8,
	CONSTRAINT asset_pkey PRIMARY KEY (chain_id, token_id),
	CONSTRAINT asset_owner_fkey FOREIGN KEY (owner) REFERENCES public.user(address),
	CONSTRAINT asset_chain_id_fkey FOREIGN KEY (chain_id) REFERENCES public.chain(chain_id)
);

-- DROP TABLE public.operator_assignment;

CREATE TABLE public.operator_assignment (
	operator CITEXT NOT NULL,
	assigner CITEXT NOT NULL,
	chain_id int4 NOT NULL,
	timestamp int8 NOT NULL,
	CONSTRAINT operator_assignment_pkey PRIMARY KEY (operator, assigner, chain_id),
	CONSTRAINT assigner_fkey FOREIGN KEY (assigner) REFERENCES public.user(address)
);

-- DROP TABLE public.attack_species;

CREATE TABLE public.attack_species (
    id SERIAL PRIMARY KEY,
	name CITEXT NOT NULL,
	description CITEXT NOT NULL,
	rarity INTEGER NOT NULL
);

-- DROP TABLE public.defend_species;

CREATE TABLE public.defend_species (
    id SERIAL PRIMARY KEY,
	name CITEXT NOT NULL,
	description CITEXT NOT NULL,
	rarity INTEGER NOT NULL
);

-- DROP TABLE public.nft_type;

CREATE TABLE public.nft_type (
	id int4 NOT NULL,
    name CITEXT NOT NULL,
    xp_levels int8[] NOT NULL,
    cost_levels int8[] NOT NULL
);

-- DROP TABLE public.info;

CREATE TABLE public.info (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL
);

CREATE TYPE status_enum AS ENUM ('FREE', 'PROCESSING');

-- DROP TABLE public.process_status;

CREATE TABLE public.process_status (
    id SERIAL PRIMARY KEY,
    status status_enum NOT NULL,
    last_update timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO public.chain (chain_id,"name",score) VALUES (137,'Polygon PoS',0);
INSERT INTO public.chain (chain_id,"name",score) VALUES (1,'Ethereum',0);
INSERT INTO public.chain (chain_id,"name",score) VALUES (42161,'Arbitrum One',0);
INSERT INTO public.process_status (status,last_update) VALUES ('FREE',CURRENT_TIMESTAMP);