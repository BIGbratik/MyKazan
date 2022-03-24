    using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;


namespace Kazan_api
{
    public class Startup
    {

        public static string path = @"./data";
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(); //Добавление CORS сервиса
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseHttpsRedirection();
            app.UseDefaultFiles();
            app.UseStaticFiles();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors(builder => builder.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod()); //Подключение CORS

            app.Map("/poo", FileRead1);
            app.Map("/kvo", FileRead2);
            app.Map("/hospital", FileRead3);
            app.Map("/infec", FileRead4);
            app.Map("/bridg", FileRead5);
            app.Map("/auth", AuthCheck);
            app.Map("/add", FileWrite);


            app.UseRouting();
        }

        private static void AuthCheck(IApplicationBuilder app)
        {
            app.Run(async context =>
            {
                /*byte[] arr = new byte[context.Request.Body.Length];
                var checkKey = await context.Request.Body.ReadAsync(arr, 0, arr.Length);
                //var checkKey = await context.Request.ReadFormAsync();
                string key = JsonSerializer.Deserialize<string>(checkKey);
                string str = System.Text.Encoding.UTF8.GetString(arr);*/
                /*using (var reader = new StreamReader(context.Request.Body))
                {
                    var key = reader.ReadToEndAsync().ToString();
                    Console.WriteLine(key);
                    int res = CheckKey(key);
                    await context.Response.WriteAsync((JsonSerializer.Serialize(res)));
                }*/

                context.Request.EnableBuffering();

                using (var reader = new StreamReader(context.Request.Body))
                {
                    var key = await reader.ReadToEndAsync();
                    int res = CheckKey(key);
                    await context.Response.WriteAsync((JsonSerializer.Serialize(res)));
                }
            });
        }

        private static void FileRead1(IApplicationBuilder app)
        {
            app.Run(async context =>
            {
                await context.Response.WriteAsync((JsonSerializer.Serialize(ReedFile("poo.txt"))));
            });
        }

        private static void FileRead2(IApplicationBuilder app)
        {
            app.Run(async context =>
            {
                await context.Response.WriteAsync((JsonSerializer.Serialize(ReedFile("kvo.txt"))));
            });
        }

        private static void FileRead3(IApplicationBuilder app)
        {
            app.Run(async context =>
            {
                await context.Response.WriteAsync((JsonSerializer.Serialize(ReedFile("hospital.txt"))));
            });
        }

        private static void FileRead4(IApplicationBuilder app)
        {
            app.Run(async context =>
            {
                await context.Response.WriteAsync((JsonSerializer.Serialize(ReedFile("infec.txt"))));
            });
        }

        private static void FileRead5(IApplicationBuilder app)
        {
            app.Run(async context =>
            {
                await context.Response.WriteAsync((JsonSerializer.Serialize(ReedFile("bridg.txt"))));
            });
        }

        private static void FileWrite(IApplicationBuilder app)
        {
            app.Run(async context =>
            {
                Message addStr=await context.Request.ReadFromJsonAsync<Message>();
                WriteFile(addStr);
            });
        }

        private static List<Coord> ReedFile(string fname)
        {
            Console.WriteLine(DateTime.Now + " - Началась выгрузка данных из файла: " + fname);
            List<Coord> dataList = new List<Coord>();
            //string path = @"/data";
            string[] str;
            using (FileStream fStr = new FileStream($"{path}/" + fname, FileMode.OpenOrCreate))
            {
                byte[] arr = new byte[fStr.Length];
                fStr.Read(arr, 0, arr.Length);
                string fText = System.Text.Encoding.UTF8.GetString(arr);
                str = fText.Split('\n');
            }
            for (int i = 0; i < str.Length; i++)
            {
                string[] line = str[i].Split("|");
                Coord data = new Coord();
                data.Coordinates = new double[2];
                data.Coordinates[0] = Convert.ToDouble(line[0]);
                data.Coordinates[1] = Convert.ToDouble(line[1]);
                data.Name = line[2];
                if (line.Length == 4)
                {
                    data.Extra = line[3];
                }
                dataList.Add(data);
            }
            Console.WriteLine(DateTime.Now + " - Выгрузка данных прошла успешно!!!");
            return dataList;
        }

        private static void WriteFile(Message list)
        {
            string str = list.Coordinates[0] + "|" + list.Coordinates[1] + "|" + list.Name;
            if (list.Extra != "")
            {
                str = str + "|" + list.Extra;
            }
            //string path = @"/data";
            using (FileStream fStr = new FileStream($"{path}/" + list.File + ".txt", FileMode.OpenOrCreate))
            {
                byte[] arr = System.Text.Encoding.Default.GetBytes("\n" + str);
                fStr.Seek(0, SeekOrigin.End);
                fStr.Write(arr, 0, arr.Length);
            }
            Console.WriteLine(DateTime.Now + " - Була успешно добавлена запись в файл: " + list.File + ".txt");
        }

        private static int CheckKey(string key)
        {
            key = key.Substring(1, key.Length - 2);
            Console.WriteLine(DateTime.Now + " - Началась проверка ключа доступа ");
            int res = 0;
            //string path = @"/data";
            string fName = "keys.txt";
            string[] str;
            using (FileStream fStr = new FileStream($"{path}/" + fName, FileMode.OpenOrCreate))
            {
                byte[] arr = new byte[fStr.Length];
                fStr.Read(arr, 0, arr.Length);
                string fText = System.Text.Encoding.UTF8.GetString(arr);
                str = fText.Split('|');
            }
            for (int i = 0; i < str.Length; i++)
            {
                if (str[i] == key)
                {
                    res = 1;
                    break;
                }
            }
            Console.WriteLine(DateTime.Now + " - Проверка ключа доступа завершилась");
            return res;
        }
    }

    class Coord
    {
        public double[] Coordinates { get; set; }

        public string Name { get; set; }

        public string Extra { get; set; }
    }

    class Message
    {
        public string File { get; set; }
        public double[] Coordinates { get; set; }

        public string Name { get; set; }

        public string Extra { get; set; }
    }
}
