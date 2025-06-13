using OpenQA.Selenium;
using OpenQA.Selenium.Interactions;
using OpenQA.Selenium.Support.UI;

namespace SeleniumTesting.Pages
{
    public class MemberPage
    {
        private readonly IWebDriver _driver;

        public MemberPage(IWebDriver driver)
        {
            _driver = driver;
        }

        public void NavigateToMemberPage()
        {
            _driver.Navigate().GoToUrl("http://localhost/test/wp-admin/users.php");
        }

        public void GoToAddNewUserPage()
        {
            _driver.Navigate().GoToUrl("http://localhost/test/wp-admin/user-new.php");
        }


        public void CreateNewUser(string username, string email, string password)
        {
            _driver.FindElement(By.Id("user_login")).SendKeys(username);
            _driver.FindElement(By.Id("email")).SendKeys(email);
            _driver.FindElement(By.Id("pass1")).SendKeys(password);
            _driver.FindElement(By.Id("createusersub")).Click();
        }

        public bool IsUserDisplayed(string username)
        {
            _driver.Navigate().GoToUrl("http://localhost/test/wp-admin/users.php");
            return _driver.PageSource.Contains(username);
        }

        public void GoToEditUserPage(string username)
        {
            var userLink = _driver.FindElement(By.LinkText(username));
            userLink.Click();
        }

        public void UpdateDisplayName(string displayName)
        {
            var displayNameInput = _driver.FindElement(By.Id("nickname"));
            displayNameInput.Clear();
            displayNameInput.SendKeys(displayName);
            _driver.FindElement(By.Id("submit")).Click(); 
        }

        public bool IsUpdated()
        {
            try
            {
                var confirmationMessage = _driver.FindElement(By.CssSelector(".updated"));
                return confirmationMessage.Text.Contains("Người dùng đã được cập nhật.");
            }
            catch (NoSuchElementException)
            {
                return false;
            }
        }

        public void DeleteUser(string username)
        {
            var userRow = _driver.FindElement(By.XPath($"//tr[.//strong//a[text()='{username}']]"));

            Actions action = new Actions(_driver);
            action.MoveToElement(userRow).Perform();
            Thread.Sleep(500);

            var deleteLink = userRow.FindElement(By.LinkText("Xóa"));
            deleteLink.Click();
            Thread.Sleep(1000);

            var confirmButton = _driver.FindElements(By.Id("submit")).FirstOrDefault();
            if (confirmButton != null)
            {
                confirmButton.Click();
                Thread.Sleep(1000);
            }
        }

        public bool IsUserExist(string username)
        {
            try
            {
                _driver.FindElement(By.LinkText(username));
                return true;
            }
            catch (NoSuchElementException)
            {
                return false;
            }
        }

        public void SearchUser(string keyword)
        {
            var searchBox = _driver.FindElement(By.Id("user-search-input"));
            searchBox.Clear();
            searchBox.SendKeys(keyword);

            var searchButton = _driver.FindElement(By.Id("search-submit"));
            searchButton.Click();
        }

        public bool IsUserExistWithKeyword(string keyword)
        {
            try
            {
                WebDriverWait wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(5));
                wait.Until(driver => driver.FindElement(By.CssSelector("table.wp-list-table")));

                var userLinks = _driver.FindElements(By.CssSelector("table.wp-list-table.users strong a"));

                foreach (var link in userLinks)
                {
                    Console.WriteLine("Tìm thấy: " + link.Text);
                    if (link.Text.Contains(keyword, StringComparison.OrdinalIgnoreCase))
                        return true;
                }

                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Lỗi khi tìm user: " + ex.Message);
                return false;
            }
        }

    }
}
