import { Router } from "express";
import { tarefaController } from "../controllers/index.js";
import {
  validate,
  createTarefaSchema,
  updateTarefaSchema,
  tarefaObjectIdParamSchema,
} from "../middlewares/index.js";

const router = Router();

router.get("/", tarefaController.listarTarefas);
router.get(
  "/:objectId",
  validate(tarefaObjectIdParamSchema),
  tarefaController.buscarTarefa
);
router.post("/", validate(createTarefaSchema), tarefaController.criarTarefa);
router.put(
  "/:objectId",
  validate(tarefaObjectIdParamSchema),
  validate(updateTarefaSchema),
  tarefaController.atualizarTarefa
);
router.delete(
  "/:objectId",
  validate(tarefaObjectIdParamSchema),
  tarefaController.excluirTarefa
);

export default router;
