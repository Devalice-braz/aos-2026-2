import test from "node:test";
import assert from "node:assert/strict";
import Sequelize from "sequelize";
import pg from "pg";

import getTarefaModel from "../src/models/tarefa.js";
import {
  createTarefaSchema,
  updateTarefaSchema,
  tarefaObjectIdParamSchema,
} from "../src/middlewares/validationSchemas.js";

const VALID_UUID = "c253ffec-c3eb-460f-b42e-152e00e23e20";

test("createTarefaSchema exige descricao e usa concluida false como padrão", () => {
  const result = createTarefaSchema.safeParse({
    body: { descricao: "  Estudar  " },
  });

  assert.equal(result.success, true);
  assert.deepEqual(result.data.body, { descricao: "Estudar", concluida: false });
  assert.equal(
    createTarefaSchema.safeParse({ body: { descricao: "   " } }).success,
    false
  );
  assert.equal(
    createTarefaSchema.safeParse({
      body: { descricao: "Estudar", concluida: "sim" },
    }).success,
    false
  );
});

test("updateTarefaSchema aceita atualizações parciais e exige ao menos um campo", () => {
  assert.equal(
    updateTarefaSchema.safeParse({ body: { concluida: true } }).success,
    true
  );
  assert.equal(
    updateTarefaSchema.safeParse({ body: { descricao: "Revisar" } }).success,
    true
  );
  assert.equal(updateTarefaSchema.safeParse({ body: {} }).success, false);
  assert.equal(
    updateTarefaSchema.safeParse({ body: { descricao: " " } }).success,
    false
  );
});

test("tarefaObjectIdParamSchema aceita UUID e rejeita identificador inválido", () => {
  assert.equal(
    tarefaObjectIdParamSchema.safeParse({
      params: { objectId: VALID_UUID },
    }).success,
    true
  );
  assert.equal(
    tarefaObjectIdParamSchema.safeParse({
      params: { objectId: "id-invalido" },
    }).success,
    false
  );
});

test("modelo Tarefa gera UUID e define concluida como false por padrão", () => {
  const sequelize = new Sequelize(
    "postgres://dummy:dummy@localhost:5432/dummy_db",
    {
      dialect: "postgres",
      dialectModule: pg,
      logging: false,
    }
  );
  const Tarefa = getTarefaModel(sequelize, Sequelize);
  const tarefa = Tarefa.build({ descricao: "Estudar" });

  assert.match(
    tarefa.objectId,
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  );
  assert.equal(tarefa.concluida, false);
});
