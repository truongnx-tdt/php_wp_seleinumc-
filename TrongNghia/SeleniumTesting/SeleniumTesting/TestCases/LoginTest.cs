using NUnit.Framework;
using OpenQA.Selenium;
using SeleniumTesting.Base;
using SeleniumTesting.Pages;
using System.Threading;

namespace SeleniumTesting.Tests
{
    public class LoginTest : BaseTest
    {
        [Test]
        public void TC001_Login_With_Valid_Credentials_Should_Succeed()
        {
            var loginPage = new LoginPage(Driver);
            loginPage.NavigateToLoginPage();
            loginPage.Login("test", "123456789");
            Assert.That(Driver.Url.Contains("wp-admin"), Is.True, "Không chuyển đến trang quản trị sau khi đăng nhập thành công.");
        }

        [Test]
        public void TC002_Login_With_Invalid_Password_Should_Fail()
        {
            var loginPage = new LoginPage(Driver);
            loginPage.NavigateToLoginPage();
            loginPage.Login("test", "12332123");
            var errorMessage = Driver.FindElement(By.Id("login_error")).Text;
            Assert.That(errorMessage.Contains("không chính xác"), Is.True, "Không hiển thị thông báo lỗi đúng khi sai mật khẩu.");
        }

        [Test]
        public void TC003_Login_With_Empty_Fields_Should_Fail()
        {
            var loginPage = new LoginPage(Driver);
            loginPage.NavigateToLoginPage();
            loginPage.Login("", "");
            var usernameValid = (bool)((IJavaScriptExecutor)Driver)
                .ExecuteScript("return document.getElementById('user_login').checkValidity();");
            var passwordValid = (bool)((IJavaScriptExecutor)Driver)
                .ExecuteScript("return document.getElementById('user_pass').checkValidity();");
            Assert.That(usernameValid, Is.False, "Username không bị đánh dấu là invalid.");
            Assert.That(passwordValid, Is.False, "Password không bị đánh dấu là invalid.");
        }
        [Test]
        public void TC004_Login_With_SQL_Injection_Should_Fail()
        {
            var loginPage = new LoginPage(Driver);
            loginPage.NavigateToLoginPage();
            loginPage.Login("' OR '1'='1", "abc");
            var errorMessage = Driver.FindElement(By.Id("login_error")).Text;
            Assert.That(errorMessage.Contains("không được đăng ký"), Is.True, "Không ngăn chặn được login với chuỗi SQL injection.");
        }

        [Test]
        public void TC005_Login_With_Empty_Username_Should_Fail()
        {
            var loginPage = new LoginPage(Driver);
            loginPage.NavigateToLoginPage();
            loginPage.Login("", "abc");
            var usernameValid = (bool)((IJavaScriptExecutor)Driver)
                 .ExecuteScript("return document.getElementById('user_login').checkValidity();");
            Assert.That(usernameValid, Is.False, "Username không bị đánh dấu là invalid.");
        }

        [Test]
        public void TC006_Login_With_Empty_Password_Should_Fail()
        {
            var loginPage = new LoginPage(Driver);
            loginPage.NavigateToLoginPage();
            loginPage.Login("test", "");
            var passwordValid = (bool)((IJavaScriptExecutor)Driver)
               .ExecuteScript("return document.getElementById('user_pass').checkValidity();");
            Assert.That(passwordValid, Is.False, "Password không bị đánh dấu là invalid.");
        }

    }
}
