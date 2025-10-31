import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { handleError, notFound } from "./errors";

type ModelDelegate = {
  findMany: (args?: any) => Promise<any[]>;
  findUnique: (args: { where: any; include?: any }) => Promise<any | null>;
  create: (args: { data: any }) => Promise<any>;
  update: (args: { where: any; data: any }) => Promise<any>;
  delete: (args: { where: any }) => Promise<any>;
};

export class CRUDFactory {
  constructor(
    private prisma: PrismaClient,
    private modelName: string,
    private modelDelegate: ModelDelegate
  ) {}

  async getAll(options?: {
    where?: any;
    include?: any;
    orderBy?: any;
    take?: number;
    skip?: number;
  }): Promise<NextResponse> {
    try {
      const records = await this.modelDelegate.findMany({
        where: options?.where,
        include: options?.include,
        orderBy: options?.orderBy || { createdAt: "desc" },
        take: options?.take,
        skip: options?.skip,
      });

      return NextResponse.json(
        {
          success: true,
          data: records,
          count: records.length,
        },
        { status: 200 }
      );
    } catch (error) {
      return handleError(error);
    }
  }

  async getById(
    id: string,
    options?: {
      include?: any;
    }
  ): Promise<NextResponse> {
    try {
      const findArgs: any = { where: { id } };
      if (options?.include) {
        findArgs.include = options.include;
      }

      const record = await this.modelDelegate.findUnique(findArgs);

      if (!record) {
        return handleError(notFound(`${this.modelName} not found`));
      }

      return NextResponse.json(
        {
          success: true,
          data: record,
        },
        { status: 200 }
      );
    } catch (error) {
      return handleError(error);
    }
  }

  async create(
    data: any,
    options?: { exclude?: string[] }
  ): Promise<NextResponse> {
    try {
      const record = await this.modelDelegate.create({ data });

      // Exclude sensitive fields from response
      if (options?.exclude) {
        options.exclude.forEach((field) => {
          delete record[field];
        });
      }

      return NextResponse.json(
        {
          success: true,
          data: record,
          message: `${this.modelName} created successfully`,
        },
        { status: 201 }
      );
    } catch (error) {
      return handleError(error);
    }
  }

  async update(
    id: string,
    data: any,
    options?: { exclude?: string[] }
  ): Promise<NextResponse> {
    try {
      // Check if record exists
      const existing = await this.modelDelegate.findUnique({
        where: { id },
      });

      if (!existing) {
        return handleError(notFound(`${this.modelName} not found`));
      }

      const record = await this.modelDelegate.update({
        where: { id },
        data,
      });

      // Exclude sensitive fields from response
      if (options?.exclude) {
        options.exclude.forEach((field) => {
          delete record[field];
        });
      }

      return NextResponse.json(
        {
          success: true,
          data: record,
          message: `${this.modelName} updated successfully`,
        },
        { status: 200 }
      );
    } catch (error) {
      return handleError(error);
    }
  }

  async delete(id: string): Promise<NextResponse> {
    try {
      // Check if record exists
      const existing = await this.modelDelegate.findUnique({
        where: { id },
      });

      if (!existing) {
        return handleError(notFound(`${this.modelName} not found`));
      }

      await this.modelDelegate.delete({
        where: { id },
      });

      return NextResponse.json(
        {
          success: true,
          message: `${this.modelName} deleted successfully`,
        },
        { status: 200 }
      );
    } catch (error) {
      return handleError(error);
    }
  }
}
