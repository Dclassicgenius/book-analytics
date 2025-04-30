import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="container py-10 mx-auto px-7">
      <h1 className="text-3xl font-bold mb-6">Аналитика книг</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Статистика доходов</CardTitle>
            <CardDescription>
              Просмотр статистики доходов от продаж книг
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Анализируйте доходы от продаж книг за разные периоды времени с
              помощью интерактивных графиков.
            </p>
          </CardContent>
          <CardFooter>
            <Link
              href="/statistics?tab=month"
              className={cn(buttonVariants({ variant: "default" }))}
            >
              Перейти к статистике
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Каталог книг</CardTitle>
            <CardDescription>Управление книгами в системе</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Здесь вы можете добавлять, редактировать и удалять книги в
              системе.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline">Скоро будет доступно</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Отчеты</CardTitle>
            <CardDescription>Генерация отчетов по продажам</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Создавайте и экспортируйте подробные отчеты по продажам книг за
              выбранный период.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline">Скоро будет доступно</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
