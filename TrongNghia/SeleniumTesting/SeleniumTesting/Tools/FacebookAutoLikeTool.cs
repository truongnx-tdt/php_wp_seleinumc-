
namespace MyNamespace
{
    using Newtonsoft.Json.Linq;
    using OpenQA.Selenium;
    using OpenQA.Selenium.Chrome;
    using OpenQA.Selenium.Interactions;
    using OpenQA.Selenium.Support.UI;
    using SeleniumTesting.Models;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Text.Json;
    using System.Threading;
    using System.Threading.Tasks;

    public class FbTool
    {
        private static IWebDriver driver;
        private static WebDriverWait wait;
        private static string facebookCookie;
        private static int taskCount = 0;
        private static bool isRunning = true;

        private static string _cookieTtc = "";
        private static HttpClient _httpClient;


        public void Run()
        {
            Console.OutputEncoding = System.Text.Encoding.UTF8;
            Console.WriteLine("=== FACEBOOK AUTO LIKE TOOL ===");
            Console.WriteLine("Phiên bản: 1.0");
            Console.WriteLine("=================================\n");

            try
            {
                // Get Facebook cookie
                Console.WriteLine("Nhập cookie Facebook của bạn:");
                Console.WriteLine("(Lấy từ F12 > Application > Cookies > facebook.com)");
                Console.Write("Cookie: ");
                facebookCookie = "ps_l=1;datr=-5BkaBiiaUC0mgjbaqxOaQkM;fr=1JbTpmvGrq5u1grGu.AWfs9_xMC4sA1-AfdAwQc6D1Nhft9wR0oYNCiuvpQOMQW_-Jc7c.Bobj4N..AAA.0.0.Bobj4N.AWd_4gnKerXBLowOcBXluDmxkRw;xs=12%3Aphmn_NZhpVyQHg%3A2%3A1751421180%3A-1%3A-1%3A%3AAcVpUoCPVuYBtDDSsGwA9wl3SwOmqWYIyknQC08NbH8;c_user=100050610481825;presence=C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1752055308848%2C%22v%22%3A1%7D;ar_debug=1;dpr=0.8999999761581421;ps_n=1;sb=VVljaJR6VEmBUHLHBjRPTt29;wd=1825x832";

                if (string.IsNullOrEmpty(facebookCookie))
                {
                    Console.WriteLine("Cookie không được để trống!");
                    Console.ReadKey();
                    return;
                }

                // Thay vì nhập cookie, nhập username và password
                Console.WriteLine("\nNhập thông tin đăng nhập TuongTacCheo:");
                Console.Write("Tài khoản: ");
                string username = "okemmmmmm";
                if (string.IsNullOrEmpty(username))
                {
                    Console.WriteLine("Tài khoản không được để trống!");
                    Console.ReadKey();
                    return;
                }

                Console.Write("Mật khẩu: ");
                string password = "truong123";
                if (string.IsNullOrEmpty(password))
                {
                    Console.WriteLine("Mật khẩu không được để trống!");
                    Console.ReadKey();
                    return;
                }

                // Initialize browser
                InitializeDriver();

                // Set Facebook cookies
                SetFacebookCookie();

                // Set TuongTacCheo cookies
                LoginToTuongTacCheo(username, password);

                GetCookieTTC();

                Console.WriteLine("\nNhấn ENTER để bắt đầu hoặc 'q' để thoát:");
                var input = Console.ReadLine();
                if (input?.ToLower() == "q")
                {
                    return;
                }

                //// Start auto like process
                Task.Run(async () => await StartAutoLike());


            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi chính: {ex.Message}");
                LogError(ex);
            }
            finally
            {
                Console.WriteLine("\nNhấn phím bất kỳ để thoát...");
                Console.ReadKey();
                CleanUp();
            }
        }

        private static void GetCookieTTC()
        {
            // Navigate to Facebook first
            driver.Navigate().GoToUrl("https://tuongtaccheo.com/caidat/");

            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));

            var element = wait.Until(d =>
            {
                var e = d.FindElement(By.Id("ccttc"));
                var val = e.GetAttribute("value");
                return !string.IsNullOrEmpty(val) ? e : null;
            });

            _cookieTtc = element.GetAttribute("value");
        }

        private static void InitializeDriver()
        {
            try
            {
                Console.WriteLine("Khởi tạo trình duyệt...");

                var options = new ChromeOptions();

                // Basic options
                //options.AddArgument("--headless=new");        // Chạy Chrome ngầm
                options.AddArgument("--disable-blink-features=AutomationControlled");
                options.AddArgument("--disable-extensions");
                options.AddArgument("--no-sandbox");
                options.AddArgument("--disable-dev-shm-usage");
                options.AddArgument("--disable-gpu");
                options.AddArgument("--disable-web-security");
                options.AddArgument("--allow-running-insecure-content");

                // User agent to avoid detection
                options.AddArgument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");

                // Disable automation flags
                options.AddExcludedArgument("enable-automation");
                options.AddAdditionalOption("useAutomationExtension", false);

                // Các options để tắt GPU và WebGL errors
                options.AddArgument("--disable-software-rasterizer");

                // Tắt logging để giảm noise
                options.AddArgument("--disable-logging");
                options.AddArgument("--log-level=3");
                options.AddArgument("--silent");

                // Tắt các feature liên quan đến WebGL
                options.AddArgument("--disable-features=WebGL");
                options.AddArgument("--disable-webgl");

                driver = new ChromeDriver(options);
                wait = new WebDriverWait(driver, TimeSpan.FromSeconds(15));

                // Hide automation indicators
                ((IJavaScriptExecutor)driver).ExecuteScript("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})");

                driver.Manage().Window.Size = new System.Drawing.Size(1200, 800);
                driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);

                Console.WriteLine("Trình duyệt đã được khởi tạo thành công!");
            }
            catch (Exception ex)
            {
                throw new Exception($"Không thể khởi tạo trình duyệt: {ex.Message}");
            }
        }

        private static void SetFacebookCookie()
        {
            try
            {
                Console.WriteLine("Thiết lập cookie Facebook...");

                // Navigate to Facebook first
                driver.Navigate().GoToUrl("https://www.facebook.com");
                wait.Until(d => d.Title.Contains("Facebook") || d.Url.Contains("facebook.com"));

                // Parse and add cookies
                var cookies = ParseCookieString(facebookCookie);

                foreach (var cookieData in cookies)
                {
                    try
                    {
                        var cookie = new OpenQA.Selenium.Cookie(cookieData.Key, cookieData.Value, ".facebook.com", "/", null);
                        driver.Manage().Cookies.AddCookie(cookie);
                    }
                    catch (Exception cookieEx)
                    {
                        Console.WriteLine($"Không thể thêm cookie {cookieData.Key}: {cookieEx.Message}");
                    }
                }

                // Refresh to apply cookies
                driver.Navigate().Refresh();
                Thread.Sleep(3000);

                // Check if logged in
                if (IsLoggedIntoFacebook())
                {
                    Console.WriteLine("✓ Cookie Facebook đã được thiết lập thành công!");
                }
                else
                {
                    Console.WriteLine("⚠ Cảnh báo: Có thể cookie không hợp lệ hoặc đã hết hạn");
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Lỗi khi thiết lập cookie: {ex.Message}");
            }
        }
        private static void LoginToTuongTacCheo(string username, string password)
        {
            try
            {
                Console.WriteLine("Đang đăng nhập vào TuongTacCheo...");

                // Navigate to TuongTacCheo login page
                driver.Navigate().GoToUrl("https://tuongtaccheo.com/login.php");
                wait.Until(d => d.Url.Contains("login.php") || d.FindElements(By.Name("username")).Count > 0);

                Thread.Sleep(1000);

                // Tìm và điền thông tin đăng nhập
                // Thử các selector phổ biến cho username
                IWebElement usernameField = null;
                string[] usernameSelectors = {
            "input[name='username']",
            "input[name='user']",
            "input[name='email']",
            "input[type='text']",
            "#username",
            "#user",
            "#email"
        };

                foreach (string selector in usernameSelectors)
                {
                    try
                    {
                        usernameField = driver.FindElement(By.CssSelector(selector));
                        if (usernameField != null && usernameField.Displayed)
                            break;
                    }
                    catch { continue; }
                }

                if (usernameField == null)
                {
                    throw new Exception("Không tìm thấy trường nhập tài khoản");
                }

                // Tìm trường password
                IWebElement passwordField = null;
                string[] passwordSelectors = {
            "input[name='password']",
            "input[name='pass']",
            "input[type='password']",
            "#password",
            "#pass"
        };

                foreach (string selector in passwordSelectors)
                {
                    try
                    {
                        passwordField = driver.FindElement(By.CssSelector(selector));
                        if (passwordField != null && passwordField.Displayed)
                            break;
                    }
                    catch { continue; }
                }

                if (passwordField == null)
                {
                    throw new Exception("Không tìm thấy trường nhập mật khẩu");
                }

                // Điền thông tin đăng nhập
                usernameField.Clear();
                usernameField.SendKeys(username);
                Thread.Sleep(500);

                passwordField.Clear();
                passwordField.SendKeys(password);
                Thread.Sleep(500);

                // Tìm và click nút đăng nhập
                IWebElement loginButton = null;
                string[] loginButtonSelectors = {
            "input[type='submit']",
            "task[type='submit']",
            "input[value*='Đăng nhập']",
            "input[value*='Login']",
            "task:contains('Đăng nhập')",
            "task:contains('Login')",
            ".btn-login",
            "#login-btn"
        };

                foreach (string selector in loginButtonSelectors)
                {
                    try
                    {
                        loginButton = driver.FindElement(By.CssSelector(selector));
                        if (loginButton != null && loginButton.Displayed)
                            break;
                    }
                    catch { continue; }
                }

                if (loginButton == null)
                {
                    // Thử submit form trực tiếp
                    passwordField.SendKeys(Keys.Enter);
                }
                else
                {
                    loginButton.Click();
                }

                // Đợi redirect sau khi đăng nhập
                Thread.Sleep(1000);

                // Check if login successful
                if (IsLoggedIntoTuongTacCheo())
                {
                    Console.WriteLine("✓ Đăng nhập TuongTacCheo thành công!");
                }
                else
                {
                    // Kiểm tra có thông báo lỗi không
                    try
                    {
                        var errorElements = driver.FindElements(By.CssSelector(".error, .alert-danger, .text-danger"));
                        if (errorElements.Count > 0)
                        {
                            string errorMsg = errorElements[0].Text;
                            throw new Exception($"Đăng nhập thất bại: {errorMsg}");
                        }
                    }
                    catch { }

                    throw new Exception("Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu.");
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Lỗi khi đăng nhập TuongTacCheo: {ex.Message}");
            }
        }

        private static bool IsLoggedIntoTuongTacCheo()
        {
            try
            {
                if (driver.Url.Contains("login.php"))
                    return false;
                return true;
            }
            catch
            {
                return false;
            }
        }
        private static Dictionary<string, string> ParseCookieString(string cookieString)
        {
            var cookies = new Dictionary<string, string>();

            try
            {
                var cookiePairs = cookieString.Split(';');

                foreach (var pair in cookiePairs)
                {
                    var trimmedPair = pair.Trim();
                    if (string.IsNullOrEmpty(trimmedPair)) continue;

                    var equalIndex = trimmedPair.IndexOf('=');
                    if (equalIndex > 0)
                    {
                        var name = trimmedPair.Substring(0, equalIndex).Trim();
                        var value = trimmedPair.Substring(equalIndex + 1).Trim();

                        if (!string.IsNullOrEmpty(name) && !string.IsNullOrEmpty(value))
                        {
                            cookies[name] = value;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi khi phân tích cookie: {ex.Message}");
            }

            return cookies;
        }

        private static bool IsLoggedIntoFacebook()
        {
            try
            {
                // Check for elements that only appear when logged in
                var loginIndicators = new[]
                {
                    "[data-testid='blue_bar_profile_link']",
                    "[aria-label*='Cài đặt và kiểm soát tài khoản']",
                    "[data-click='profile_icon']",
                    "//div[contains(@aria-label, 'Account')]"
                };

                foreach (var selector in loginIndicators)
                {
                    try
                    {
                        IWebElement element = null;
                        if (selector.StartsWith("//"))
                        {
                            element = driver.FindElement(By.XPath(selector));
                        }
                        else
                        {
                            element = driver.FindElement(By.CssSelector(selector));
                        }

                        if (element != null && element.Displayed)
                        {
                            return true;
                        }
                    }
                    catch (NoSuchElementException)
                    {
                        continue;
                    }
                }

                return false;
            }
            catch
            {
                return false;
            }
        }

        private static async Task StartAutoLike()
        {
            try
            {
                Console.WriteLine("\n=== BẮT ĐẦU QUÁ TRÌNH AUTO LIKE ===");
                Console.WriteLine("Nhấn Ctrl+C để dừng bất cứ lúc nào\n");

                // Setup Ctrl+C handler
                Console.CancelKeyPress += (sender, e) =>
                {
                    e.Cancel = true;
                    isRunning = false;
                    Console.WriteLine("\nĐang dừng lại...");
                };

                int consecutiveErrors = 0;
                const int maxConsecutiveErrors = 5;

                while (isRunning)
                {
                    try
                    {

                        // Find and execute like tasks
                        var likeTasks = await FindLikeTasksAsync();

                        if (likeTasks.Count == 0)
                        {
                            Console.WriteLine("⚠ Không tìm thấy nhiệm vụ nào, chờ 10s và thử lại...");
                            Thread.Sleep(10000);
                            likeTasks = await FindLikeTasksAsync();
                        }

                        int currentBatchCount = 0;
                        foreach (var task in likeTasks)
                        {
                            if (!isRunning) break;

                            try
                            {
                                ExecuteLikeTask(task);
                                taskCount++;
                                currentBatchCount++;
                                consecutiveErrors = 0; // Reset error counter on success

                                Console.WriteLine($"✓ Hoàn thành nhiệm vụ {taskCount}");

                                // Random delay between tasks
                                var delay = new Random().Next(2000, 4000);
                                Thread.Sleep(delay);

                                // Break after 5 tasks to get new posts
                                if (currentBatchCount >= 5)
                                {
                                    Console.WriteLine("📝 Đã hoàn thành 5 nhiệm vụ, sẽ lấy danh sách mới...");
                                    break;
                                }
                            }
                            catch (Exception taskEx)
                            {
                                Console.WriteLine($"❌ Lỗi khi thực hiện nhiệm vụ: {taskEx.Message}");
                                consecutiveErrors++;

                                if (consecutiveErrors >= maxConsecutiveErrors)
                                {
                                    Console.WriteLine($"⚠ Quá nhiều lỗi liên tiếp ({consecutiveErrors}), tạm dừng 30s...");
                                    Thread.Sleep(30000);
                                    consecutiveErrors = 0;
                                }

                                // Try to recover
                                RecoverFromError();
                            }
                        }

                        // Small break between batches
                        if (isRunning && currentBatchCount > 0)
                        {
                            Console.WriteLine("💤 Nghỉ 5s trước khi tiếp tục...\n");
                            Task.Run(async () => { await LoginWithToken("c80ef8be6c318b249aa266181b881b4a"); });
                            Thread.Sleep(5000);
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"❌ Lỗi trong vòng lặp chính: {ex.Message}");
                        consecutiveErrors++;

                        if (consecutiveErrors >= maxConsecutiveErrors)
                        {
                            Console.WriteLine("⚠ Quá nhiều lỗi, dừng chương trình để tránh spam...");
                            break;
                        }

                        Thread.Sleep(10000);
                        RecoverFromError();
                    }
                }

                Console.WriteLine($"\n=== KẾT THÚC ===");
                Console.WriteLine($"Tổng số nhiệm vụ đã hoàn thành: {taskCount}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Lỗi nghiêm trọng: {ex.Message}");
                LogError(ex);
            }
        }

        private static async Task<List<TaskTtc>> FindLikeTasksAsync()
        {
            var tasks = new List<TaskTtc>();
            try
            {
                Console.WriteLine("🔍 Đang tìm nhiệm vụ like...");

                // Initialize HttpClient if needed
                if (_httpClient == null)
                {
                    _httpClient = new HttpClient();
                    SetDefaultHeaders();
                }

                var response = await _httpClient.GetAsync("https://tuongtaccheo.com/kiemtien/likepostvipcheo/getpost.php");

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    tasks = ParseTasksFromResponse(content);
                    Console.WriteLine($"✅ Tìm thấy {tasks.Count} nhiệm vụ like");
                }
                else
                {
                    Console.WriteLine($"⚠ Lỗi HTTP: {response.StatusCode}");
                }
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine($"⚠ Lỗi kết nối: {ex.Message}");
            }
            catch (TaskCanceledException ex)
            {
                Console.WriteLine($"⚠ Timeout: {ex.Message}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"⚠ Lỗi không xác định: {ex.Message}");
            }

            return tasks;
        }

        private static void SetDefaultHeaders()
        {
            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("accept", "*/*");
            _httpClient.DefaultRequestHeaders.Add("origin", "https://tuongtaccheo.com");
            _httpClient.DefaultRequestHeaders.Add("referer", "https://tuongtaccheo.com/kiemtien/likepostvipcheo/");
            _httpClient.DefaultRequestHeaders.Add("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36");
            _httpClient.DefaultRequestHeaders.Add("x-requested-with", "XMLHttpRequest");

            if (!string.IsNullOrEmpty(_cookieTtc))
            {
                _httpClient.DefaultRequestHeaders.Add("Cookie", _cookieTtc);
            }
        }

        private static List<TaskTtc> ParseTasksFromResponse(string responseContent)
        {
            var tasks = new List<TaskTtc>();

            try
            {
                var jsonArray = JArray.Parse(responseContent);

                foreach (var item in jsonArray)
                {
                    var task = new TaskTtc
                    {
                        idfb = item["idfb"]?.ToString(),
                        idpost = item["idpost"]?.ToString(),
                        link = item["link"]?.ToString(),
                    };
                    tasks.Add(task);
                }
            }
            catch (JsonException ex)
            {
                Console.WriteLine($"⚠ Lỗi parse JSON: {ex.Message}");
            }

            return tasks;
        }


        private static void ExecuteLikeTask(TaskTtc task)
        {
            string originalHandle = driver.CurrentWindowHandle;
            var delay = new Random().Next(500, 1000);
            string newTabHandle = null;

            try
            {
                Console.WriteLine($"🔄 Thực hiện: {task.link}");
                Thread.Sleep(delay);

                // Method 1: Open link in new tab using JavaScript
                IJavaScriptExecutor js = (IJavaScriptExecutor)driver;
                js.ExecuteScript($"window.open('{task.link}', '_blank');");

                // Alternative Method 2: Using Ctrl+Click (if Method 1 doesn't work)
                // You would need to find a clickable element first
                // Actions actions = new Actions(driver);
                // actions.KeyDown(Keys.Control).Click(linkElement).KeyUp(Keys.Control).Perform();

                Thread.Sleep(delay);

                // Wait for new tab to open
                WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
                wait.Until(d => d.WindowHandles.Count > 1);

                // Get all window handles
                var allHandles = driver.WindowHandles;

                if (allHandles.Count > 1)
                {
                    // Find the new tab handle
                    foreach (var handle in allHandles)
                    {
                        if (handle != originalHandle)
                        {
                            newTabHandle = handle;
                            break;
                        }
                    }

                    if (newTabHandle != null)
                    {
                        // Switch to the new Facebook tab
                        driver.SwitchTo().Window(newTabHandle);
                        Console.WriteLine("✅ Đã chuyển sang tab Facebook");

                        // Wait for page to load
                        Thread.Sleep(delay);

                        // Perform like action on Facebook
                        bool likeSuccess = PerformFacebookLike();
                        Thread.Sleep(800);

                        // Close Facebook tab
                        driver.Close();

                        // Switch back to original tab
                        driver.SwitchTo().Window(originalHandle);
                        Console.WriteLine("✅ Đã quay về tab chính");

                        if (likeSuccess)
                        {
                            // Claim reward
                            Console.WriteLine("🎁 Đang nhận thưởng...");
                            Task.Run(async () => { await ClaimReward(task.idpost); });
                        }
                        else
                        {
                            Console.WriteLine("⚠ Like không thành công, bỏ qua nhận thưởng");
                        }
                    }
                    else
                    {
                        Console.WriteLine("⚠ Không tìm thấy tab mới");
                    }
                }
                else
                {
                    Console.WriteLine("⚠ Không có tab Facebook mới được mở");
                }
            }
            catch (WebDriverTimeoutException ex)
            {
                Console.WriteLine($"⏱ Timeout khi chờ tab mới: {ex.Message}");
                CleanupTabs(originalHandle);
            }
            catch (NoSuchWindowException ex)
            {
                Console.WriteLine($"⚠ Tab không tồn tại: {ex.Message}");
                CleanupTabs(originalHandle);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Lỗi khi thực hiện nhiệm vụ: {ex.Message}");
                CleanupTabs(originalHandle);
                throw;
            }
        }

        private static void CleanupTabs(string originalHandle)
        {
            try
            {
                var allHandles = driver.WindowHandles;

                // Close all tabs except original
                foreach (var handle in allHandles)
                {
                    if (handle != originalHandle)
                    {
                        try
                        {
                            driver.SwitchTo().Window(handle);
                            driver.Close();
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"⚠ Lỗi khi đóng tab: {ex.Message}");
                        }
                    }
                }

                // Switch back to original tab
                driver.SwitchTo().Window(originalHandle);
                Console.WriteLine("🔄 Đã dọn dẹp và quay về tab chính");
            }
            catch (Exception recoveryEx)
            {
                Console.WriteLine($"⚠ Lỗi khi khôi phục tab: {recoveryEx.Message}");
            }
        }

        // Alternative method using Actions (if you have a clickable element)
        private static void OpenLinkInNewTabWithActions(IWebElement linkElement)
        {
            Actions actions = new Actions(driver);
            actions.KeyDown(Keys.Control)
                   .Click(linkElement)
                   .KeyUp(Keys.Control)
                   .Perform();
        }

        // More robust method with retry logic

        private static bool PerformFacebookLike()
        {
            try
            {
                var delay = new Random().Next(1000, 1500);
                Thread.Sleep(delay);
                Console.WriteLine("🚀 Đang tìm và thực hiện like đúng ngữ cảnh...");

                IWebElement container = null;

                // 1. Tìm container: VIDEO
                var videoContainers = driver.FindElements(By.CssSelector("div.x78zum5.xdt5ytf.x6ikm8r.x10wlt62.xh8yej3.xyzno7u.x8dqta2"));
                if (videoContainers.Count > 0)
                {
                    container = videoContainers[0];
                    Console.WriteLine("🎬 Phát hiện là video");
                }

                // 2. Nếu không phải video → tìm container BÀI VIẾT
                if (container == null)
                {
                    var postContainers = driver.FindElements(By.CssSelector("div.xbmvrgn.x1diwwjn"));
                    if (postContainers.Count >= 5)
                    {
                        container = postContainers[4]; // vị trí thứ 5
                        Console.WriteLine("📝 Phát hiện là bài viết thông thường");
                    }
                    else if (postContainers.Count > 0)
                    {
                        container = postContainers[postContainers.Count - 1]; // vị trí thứ cuối
                        Console.WriteLine("📝 Phát hiện là bài viết thông thường");
                    }
                }

                // 3. Nếu không phải post → giả định là REEL (Like đơn giản hơn)
                if (container == null)
                {
                    Console.WriteLine("🎞 Phát hiện là reel hoặc layout khác — tìm like trực tiếp");
                    return TryClickLikeButton(driver);
                }

                // 4. Trong container đã xác định, tìm nút Like với các selector được cải thiện
                return FindAndClickLikeButton(container);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Lỗi khi like: {ex.Message}");
                return false;
            }
        }

        private static bool FindAndClickLikeButton(IWebElement container)
        {
            // Danh sách các selector để tìm nút Like theo độ ưu tiên
            var likeSelectors = new[]
            {
        // Selector chính xác dựa trên HTML bạn cung cấp
        "div[role='button'][aria-label='Thích'][tabindex='0']",
        
        // Selector dự phòng cho các trường hợp khác
        "div[aria-label='Thích'][role='button']",
        "div[aria-label='Like'][role='button']",
        
        // Selector dựa trên data attribute
        "span[data-ad-rendering-role='thích_button']",
        
        // Selector dựa trên text content
        "div[role='button']:contains('Thích')",
        "div[role='button']:contains('Like')",
        
        // Selector rộng hơn dựa trên class pattern
        "div.x1i10hfl.x1qjc9v5.xjbqb8w[aria-label='Thích']",
        
        // Selector cho nút chưa like (có thể khác)
        "div[role='button'][aria-label*='Thích']",
        "div[role='button'][aria-label*='Like']"
    };

            foreach (var selector in likeSelectors)
            {
                try
                {
                    var likeButtons = container.FindElements(By.CssSelector(selector));

                    if (likeButtons.Count > 0)
                    {
                        // Tìm nút like chưa được active (chưa like)
                        foreach (var button in likeButtons)
                        {
                            // Kiểm tra xem nút đã được like chưa
                            if (IsLikeButtonUnclicked(button))
                            {
                                Console.WriteLine($"✅ Tìm thấy nút like với selector: {selector}");
                                ScrollAndClick(button);
                                Console.WriteLine("👍 Đã like bài viết thành công!");
                                return true;
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"⚠ Lỗi với selector {selector}: {ex.Message}");
                    continue;
                }
            }

            Console.WriteLine("⚠ Không tìm thấy nút like phù hợp trong container.");
            return false;
        }

        private static bool IsLikeButtonUnclicked(IWebElement button)
        {
            try
            {
                // Kiểm tra các dấu hiệu nút chưa được like
                var ariaLabel = button.GetAttribute("aria-label");
                var classList = button.GetAttribute("class");

                // Nếu aria-label chứa "Thích" hoặc "Like" (chưa like)
                if (ariaLabel != null && (ariaLabel.Contains("Thích") || ariaLabel.Contains("Like")))
                {
                    // Kiểm tra xem có phải là nút "Bỏ thích" không
                    if (ariaLabel.Contains("Bỏ thích") || ariaLabel.Contains("Unlike"))
                    {
                        Console.WriteLine("⚠ Bài viết đã được like rồi");
                        return false;
                    }
                    return true;
                }

                // Kiểm tra màu sắc hoặc style để xác định trạng thái
                var computedStyle = ((IJavaScriptExecutor)driver).ExecuteScript(
                    "return window.getComputedStyle(arguments[0]).color;", button);

                return true; // Mặc định cho phép click
            }
            catch (Exception)
            {
                return true; // Nếu không kiểm tra được, thử click
            }
        }

        private static bool TryClickLikeButton(IWebDriver driver)
        {
            // Thử tìm nút like trực tiếp trên toàn bộ trang
            var globalLikeSelectors = new[]
            {
        "div[role='button'][aria-label='Thích'][tabindex='0']",
        "div[aria-label='Thích'][role='button']",
        "div[aria-label='Like'][role='button']",
        "span[data-ad-rendering-role='thích_button']"
    };

            foreach (var selector in globalLikeSelectors)
            {
                try
                {
                    var buttons = driver.FindElements(By.CssSelector(selector));

                    if (buttons.Count > 0)
                    {
                        ScrollAndClick(buttons[0]);
                        Console.WriteLine("👍 Đã like thành công (global search)!");
                        return true;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"⚠ Lỗi với global selector {selector}: {ex.Message}");
                    continue;
                }
            }

            return false;
        }

        private static void ScrollAndClick(IWebElement element)
        {
            try
            {
                // Scroll đến element
                ((IJavaScriptExecutor)driver).ExecuteScript("arguments[0].scrollIntoView(true);", element);
                Thread.Sleep(500);

                // Thử click bằng JavaScript trước
                try
                {
                    ((IJavaScriptExecutor)driver).ExecuteScript("arguments[0].click();", element);
                }
                catch
                {
                    // Nếu JS click không work, dùng Selenium click
                    element.Click();
                }

                Thread.Sleep(500);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"⚠ Lỗi khi click element: {ex.Message}");
                throw;
            }
        }

        // Alternative method using XPath for more flexible text matching
        private static bool TryClickLikeButtonWithXPath(IWebElement container)
        {
            var xpathSelectors = new[]
            {
        ".//div[@role='button' and @aria-label='Thích']",
        ".//div[@role='button' and @aria-label='Like']",
        ".//div[@role='button' and contains(@aria-label, 'Thích')]",
        ".//div[@role='button' and contains(@aria-label, 'Like')]",
        ".//span[@data-ad-rendering-role='thích_button']/ancestor::div[@role='button'][1]"
    };

            foreach (var xpath in xpathSelectors)
            {
                try
                {
                    var buttons = container.FindElements(By.XPath(xpath));

                    if (buttons.Count > 0)
                    {
                        ScrollAndClick(buttons[0]);
                        Console.WriteLine($"👍 Đã like thành công với XPath: {xpath}");
                        return true;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"⚠ Lỗi với XPath {xpath}: {ex.Message}");
                    continue;
                }
            }

            return false;
        }
        // Login method using access token
        private static async Task LoginWithToken(string accessToken)
        {
            try
            {
                Console.WriteLine("🔐 Đang lấy thông tin user...");
                // Prepare login form data
                var loginData = new FormUrlEncodedContent(new[]
                {
            new KeyValuePair<string, string>("access_token", accessToken)
        });

                // Set content type
                loginData.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/x-www-form-urlencoded");

                // Make login request
                var loginResponse = await _httpClient.PostAsync("https://tuongtaccheo.com/logintoken.php", loginData);

                if (loginResponse.IsSuccessStatusCode)
                {
                    var loginContent = await loginResponse.Content.ReadAsStringAsync();
                    Console.WriteLine($"✅ {loginContent}");
                }
                else
                {
                    Console.WriteLine($"❌{loginResponse.StatusCode} - {loginResponse.ReasonPhrase}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ {ex.Message}");
            }
        }
        private static async Task ClaimReward(string taskId)
        {
            try
            {
                Console.WriteLine($"💰 Đang nhận thưởng cho nhiệm vụ: {taskId}");
                // Prepare form data
                var formData = new FormUrlEncodedContent(new[]
                {
            new KeyValuePair<string, string>("id", taskId)
        });

                // Set content type
                formData.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/x-www-form-urlencoded")
                {
                    CharSet = "UTF-8"
                };

                // Make the POST request
                var response = await _httpClient.PostAsync("https://tuongtaccheo.com/kiemtien/likepostvipcheo/nhantien.php", formData);

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"✅ Nhận thưởng thành công: {responseContent}");
                }
                else
                {
                    Console.WriteLine($"❌ Lỗi API: {response.StatusCode} - {response.ReasonPhrase}");
                }

                Thread.Sleep(3000);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Lỗi khi nhận thưởng: {ex.Message}");
            }
        }

        private static void RecoverFromError()
        {
            try
            {
                Console.WriteLine("🔧 Đang khôi phục từ lỗi...");

                // Close any extra tabs
                var handles = driver.WindowHandles;
                var mainHandle = handles[0];

                foreach (var handle in handles.Skip(1))
                {
                    try
                    {
                        driver.SwitchTo().Window(handle);
                        driver.Close();
                    }
                    catch { }
                }

                // Switch back to main tab
                driver.SwitchTo().Window(mainHandle);

                // Check if we're still on the right page
                if (!driver.Url.Contains("tuongtaccheo.com"))
                {
                    driver.Navigate().GoToUrl("https://tuongtaccheo.com/kiemtien/likepostvipcheo/");
                    Thread.Sleep(5000);
                }

                Console.WriteLine("✓ Đã khôi phục thành công");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Không thể khôi phục: {ex.Message}");
            }
        }

        private static void LogError(Exception ex)
        {
            try
            {
                var logPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "error_log.txt");
                var logEntry = $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] {ex.GetType().Name}: {ex.Message}\n{ex.StackTrace}\n\n";
                File.AppendAllText(logPath, logEntry);
            }
            catch
            {
            }
        }

        private static void CleanUp()
        {
            try
            {
                isRunning = false;
                driver?.Quit();
                Console.WriteLine("✓ Đã dọn dẹp tài nguyên");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"⚠ Lỗi khi dọn dẹp: {ex.Message}");
            }
        }
    }

}