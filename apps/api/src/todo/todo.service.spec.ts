import { Test, TestingModule } from "@nestjs/testing";
import { TodoService } from "./todo.service";
import { PrismaService } from "../prisma/prisma.service";

describe("TodoService", () => {
    let service: TodoService;
    let prisma: PrismaService;

    const mockPrismaService = {
        todo: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TodoService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<TodoService>(TodoService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    describe("findAll", () => {
        it("should return all todos ordered by createdAt desc", async () => {
            const todos = [
                {
                    id: "1",
                    title: "Test",
                    completed: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
            mockPrismaService.todo.findMany.mockResolvedValue(todos);

            const result = await service.findAll();

            expect(result).toBe(todos);
            expect(prisma.todo.findMany).toHaveBeenCalledWith({
                orderBy: { createdAt: "desc" },
            });
        });
    });

    describe("findOne", () => {
        it("should return a todo by id", async () => {
            const todo = {
                id: "1",
                title: "Test",
                completed: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockPrismaService.todo.findUnique.mockResolvedValue(todo);

            const result = await service.findOne("1");

            expect(result).toBe(todo);
            expect(prisma.todo.findUnique).toHaveBeenCalledWith({
                where: { id: "1" },
            });
        });
    });

    describe("create", () => {
        it("should create a new todo", async () => {
            const createDto = { title: "New Todo" };
            const todo = {
                id: "1",
                ...createDto,
                completed: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockPrismaService.todo.create.mockResolvedValue(todo);

            const result = await service.create(createDto);

            expect(result).toBe(todo);
            expect(prisma.todo.create).toHaveBeenCalledWith({
                data: createDto,
            });
        });
    });

    describe("update", () => {
        it("should update a todo", async () => {
            const updateDto = { completed: true };
            const todo = {
                id: "1",
                title: "Test",
                completed: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockPrismaService.todo.update.mockResolvedValue(todo);

            const result = await service.update("1", updateDto);

            expect(result).toBe(todo);
            expect(prisma.todo.update).toHaveBeenCalledWith({
                where: { id: "1" },
                data: updateDto,
            });
        });
    });

    describe("remove", () => {
        it("should delete a todo", async () => {
            const todo = {
                id: "1",
                title: "Test",
                completed: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockPrismaService.todo.delete.mockResolvedValue(todo);

            const result = await service.remove("1");

            expect(result).toBe(todo);
            expect(prisma.todo.delete).toHaveBeenCalledWith({
                where: { id: "1" },
            });
        });
    });
});
