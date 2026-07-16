CREATE TABLE IF NOT EXISTS autores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    nacionalidade VARCHAR(100) NOT NULL,
    ano_nascimento SMALLINT NOT NULL
);

CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS livros (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    quantidade_disponivel INT NOT NULL,
    autor_id INT NOT NULL,
    CONSTRAINT fk_autor 
        FOREIGN KEY (autor_id) 
        REFERENCES autores(id) 
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS emprestimos (
    id SERIAL PRIMARY KEY,
    data_emprestimo DATE NOT NULL DEFAULT CURRENT_DATE,
    data_vencimento DATE NOT NULL,
    data_devolucao DATE,
    cliente_id INT NOT NULL,
    CONSTRAINT fk_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES clientes(id),
    livro_id INT NOT NULL,
    CONSTRAINT fk_livro
        FOREIGN KEY (livro_id)
        REFERENCES livros(id)
);