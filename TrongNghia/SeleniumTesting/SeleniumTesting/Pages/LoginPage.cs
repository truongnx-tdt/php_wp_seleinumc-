using OpenQA.Selenium;

namespace SeleniumTesting.Pages
{
    public class LoginPage
    {
        private readonly IWebDriver _driver;

        public LoginPage(IWebDriver driver)
        {
            _driver = driver;
        }

        private IWebElement UsernameInput => _driver.FindElement(By.Id("user_login"));
        private IWebElement PasswordInput => _driver.FindElement(By.Id("user_pass"));
        private IWebElement SubmitButton => _driver.FindElement(By.Id("wp-submit"));

        public void NavigateToLoginPage()
        {
            _driver.Navigate().GoToUrl("http://localhost/test/wp-login.php");
        }

        public void Login(string username, string password)
        {
            UsernameInput.SendKeys(username);
            PasswordInput.SendKeys(password);
            SubmitButton.Click();
        }
    }
}
