using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;

namespace SeleniumTesting.Pages
{
    public class NewsPage
    {
        private readonly IWebDriver _driver;
        public NewsPage(IWebDriver driver)
        {
            _driver = driver;
        }

        public void GoToWebsite()
        {
            _driver.Navigate().GoToUrl("http://localhost/test/");
            new WebDriverWait(_driver, TimeSpan.FromSeconds(10)).Until(d =>
                d.FindElement(By.TagName("body")).Displayed
            );
        }
        public void NavigateToNewsPage()
        {
            _driver.Navigate().GoToUrl("http://localhost/test/index.php/category/tin-tuc/");
        }

        public void ClickNewsMenuLink()
        {
            var newsMenuLink = _driver.FindElement(By.CssSelector("a[href*='category/tin-tuc']"));

            ((IJavaScriptExecutor)_driver).ExecuteScript("arguments[0].scrollIntoView(true);", newsMenuLink);
            Thread.Sleep(300); 
            ((IJavaScriptExecutor)_driver).ExecuteScript("arguments[0].click();", newsMenuLink);
        }

        public void ClickFirstPostInNewsSection()
        {
            ClickNewsMenuLink();
            Thread.Sleep(2000);

            var firstPostLink = new WebDriverWait(_driver, TimeSpan.FromSeconds(10))
                .Until(driver => driver.FindElement(By.CssSelector("h2.post-title.entry-title > a")));

            ((IJavaScriptExecutor)_driver).ExecuteScript("arguments[0].scrollIntoView(true);", firstPostLink);
            ((IJavaScriptExecutor)_driver).ExecuteScript("arguments[0].click();", firstPostLink);
        }
    }
}
