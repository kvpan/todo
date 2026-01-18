import { Test, TestingModule } from "@nestjs/testing";
import { TodoController } from "./todo.controller";
import { TodoService } from "./todo.service";

describe("TodoController", () => {
    let controller: TodoController;
    let service: TodoService;

    const mockTodoService = {
        findAll: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TodoController],
            providers: [
                {
                    provide: TodoService,
                    useValue: mockTodoService,
                },
            ],
        }).compile();

        controller = module.get<TodoController>(TodoController);
        service = module.get<TodoService>(TodoService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });

    describe("findAll", () => {
        it("should return an array of todos", async () => {
            const result = [
                {
                    id: "1",
                    title: "Test",
                    completed: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
            mockTodoService.findAll.mockResolvedValue(result);

            expect(await controller.findAll()).toBe(result);
            expect(service.findAll).toHaveBeenCalled();
        });
    });

    describe("findOne", () => {
        it("should return a single todo", async () => {
            const result = {
                id: "1",
                title: "Test",
                completed: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockTodoService.findOne.mockResolvedValue(result);

            expect(await controller.findOne("1")).toBe(result);
            expect(service.findOne).toHaveBeenCalledWith("1");
        });
    });

    describe("create", () => {
        it("should create a new todo", async () => {
            const createDto = { title: "New Todo" };
            const result = {
                id: "1",
                ...createDto,
                completed: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockTodoService.create.mockResolvedValue(result);

            expect(await controller.create(createDto)).toBe(result);
            expect(service.create).toHaveBeenCalledWith(createDto);
        });
    });

    describe("update", () => {
        it("should update a todo", async () => {
            const updateDto = { completed: true };
            const result = {
                id: "1",
                title: "Test",
                completed: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockTodoService.update.mockResolvedValue(result);

            expect(await controller.update("1", updateDto)).toBe(result);
            expect(service.update).toHaveBeenCalledWith("1", updateDto);
        });
    });

    describe("remove", () => {
        it("should remove a todo", async () => {
            const result = {
                id: "1",
                title: "Test",
                completed: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockTodoService.remove.mockResolvedValue(result);

            expect(await controller.remove("1")).toBe(result);
            expect(service.remove).toHaveBeenCalledWith("1");
        });
    });
});
