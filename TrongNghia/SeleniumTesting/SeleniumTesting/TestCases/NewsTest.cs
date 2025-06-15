
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using SeleniumTesting.Base;
using SeleniumTesting.Pages;

namespace SeleniumTesting.TestCases
{
    public class NewsTest : BaseTest
    {
        private NewsPage _newsPage;
        [SetUp]
        public void Setup()
        {
            _newsPage = new NewsPage(Driver);
        }

        [Test]
        public void TC001_VerifyNewsLinkNavigation()
        {
            _newsPage.GoToWebsite();
            Thread.Sleep(1000);
            _newsPage.ClickNewsMenuLink();
            Thread.Sleep(3000);
            Assert.That(Driver.Url.Contains("/category/tin-tuc"), Is.True, "Không điều hướng đúng đến trang Tin Tức.");
        }

        [Test]
        public void TC002_VerifyPostContentDisplay()
        {
            _newsPage.GoToWebsite();
            Thread.Sleep(1000);
            _newsPage.ClickFirstPostInNewsSection();
            Thread.Sleep(1500);

            var postTitle = Driver.FindElement(By.CssSelector(".entry-title, h1.post-title")).Text;
            Assert.That(string.IsNullOrEmpty(postTitle), Is.False, "Không tìm thấy tiêu đề bài viết.");

            var content = Driver.FindElement(By.CssSelector(".entry, .entry-content, .post-content")).Text;
            Assert.That(content.Length > 20, Is.True, "Nội dung bài viết quá ngắn hoặc không hiển thị.");

            var images = Driver.FindElements(By.CssSelector(".entry img, .entry-content img, .post-content img"));
            Console.WriteLine("Ảnh trong bài viết: " + images.Count);

            var dateElements = Driver.FindElements(By.CssSelector(".post-date, time.entry-date"));
            Assert.That(dateElements.Any(), Is.True, "Không tìm thấy ngày đăng bài viết.");

            //var categoryElements = Driver.FindElements(By.CssSelector(".cat-links a, .post-category a"));
            //Assert.That(categoryElements.Any(), Is.True, "Không tìm thấy chuyên mục.");
        }
    }
}
