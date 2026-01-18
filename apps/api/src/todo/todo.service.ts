import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";

@Injectable()
export class TodoService {
    constructor(private prisma: PrismaService) {}

    findAll() {
        return this.prisma.todo.findMany({
            orderBy: { createdAt: "desc" },
        });
    }

    findOne(id: string) {
        return this.prisma.todo.findUnique({
            where: { id },
        });
    }

    create(createTodoDto: CreateTodoDto) {
        return this.prisma.todo.create({
            data: createTodoDto,
        });
    }

    update(id: string, updateTodoDto: UpdateTodoDto) {
        return this.prisma.todo.update({
            where: { id },
            data: updateTodoDto,
        });
    }

    remove(id: string) {
        return this.prisma.todo.delete({
            where: { id },
        });
    }
}
