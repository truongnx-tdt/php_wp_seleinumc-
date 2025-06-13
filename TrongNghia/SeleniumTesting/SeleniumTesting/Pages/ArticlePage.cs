
using OpenQA.Selenium;
using OpenQA.Selenium.Interactions;
using OpenQA.Selenium.Support.UI;
using System.Threading;
using System.Xml.Linq;

namespace SeleniumTesting.Pages
{
    public class ArticlePage
    {
        private readonly IWebDriver _driver;

        public ArticlePage(IWebDriver driver)
        {
            _driver = driver;
        }

        public void NavigateToPostList()
        {
            _driver.Navigate().GoToUrl("http://localhost/test/wp-admin/edit.php");
        }

        public bool IsPostListPageDisplayed()
        {
            return _driver.Url.Contains("edit.php") &&
                   _driver.PageSource.Contains("Tất cả bài viết");
        }

        public void SearchPost(string keyword)
        {
            var searchInput = _driver.FindElement(By.Id("post-search-input"));
            searchInput.Clear();
            searchInput.SendKeys(keyword);

            var searchButton = _driver.FindElement(By.Id("search-submit"));
            searchButton.Click();
        }

        public bool IsSearchResultCorrect(string keyword)
        {
            var tableRows = _driver.FindElements(By.CssSelector("tbody#the-list tr"));

            if (tableRows.Count == 0)
                return false;

            foreach (var row in tableRows)
            {
                string rowText = row.Text.ToLower();
                if (rowText.Contains(keyword.ToLower()))
                    return true;
            }
            return false;
        }

        public bool DoesPostExist(string title)
        {
            try
            {
                var rows = _driver.FindElements(By.CssSelector("tbody#the-list tr"));
                return rows.Any(row => row.Text.ToLower().Contains(title.ToLower()));
            }
            catch
            {
                return false;
            }
        }

        public void TrashPost(string title)
        {
            var rows = _driver.FindElements(By.CssSelector("tbody#the-list tr"));

            foreach (var row in rows)
            {
                if (row.Text.ToLower().Contains(title.ToLower()))
                {
                    Actions actionBuilder = new Actions(_driver);
                    actionBuilder.MoveToElement(row).Perform();

                    var deleteButton = row.FindElement(By.CssSelector(".row-actions .submitdelete"));
                    var jsExecutor = (IJavaScriptExecutor)_driver;
                    jsExecutor.ExecuteScript("arguments[0].click();", deleteButton);
                    Thread.Sleep(1000);
                    _driver.Navigate().Refresh();
                    break;
                }
            }
        }

        public void NavigateToCreatePostPage()
        {
            _driver.Navigate().GoToUrl("http://localhost/test/wp-admin/post-new.php");
        }

        public void FillPostTitle(string title)
        {
            var titleBox = _driver.FindElement(By.Id("title"));
            titleBox.Clear();
            titleBox.SendKeys(title);
        }

        public void FillPostContent(string content)
        {
            _driver.SwitchTo().Frame("content_ifr");
            var contentBox = _driver.FindElement(By.Id("tinymce"));
            contentBox.Clear();
            contentBox.SendKeys(content);
            _driver.SwitchTo().DefaultContent();
        }

        public void PublishPost()
        {
            var publishButton = _driver.FindElement(By.Id("publish"));
            publishButton.Click();
        }

        public bool IsPostCreated()
        {
            try
            {
                var confirmationMessage = _driver.FindElement(By.CssSelector(".notice-success"));
                return confirmationMessage.Text.Contains("Bài viết đã được Xuất bản.");
            }
            catch (NoSuchElementException)
            {
                return false;
            }
        }

        public void EditPost(string oldTile, string title, string newContent)
        {
            var wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(10));
            var rows = _driver.FindElements(By.CssSelector("tbody#the-list tr"));

            foreach (var row in rows)
            {
                Console.WriteLine("ROW TEXT: " + row.Text);

                if (row.Text.ToLower().Contains(oldTile.ToLower()))
                {
                    try
                    {
                        var titleLink = row.FindElement(By.CssSelector("a.row-title"));
                        ((IJavaScriptExecutor)_driver).ExecuteScript("arguments[0].scrollIntoView(true);", titleLink);
                        Thread.Sleep(300);
                        ((IJavaScriptExecutor)_driver).ExecuteScript("arguments[0].click();", titleLink);
                        wait.Until(d => d.FindElement(By.Id("title")).Displayed);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("Không tìm thấy phần tử chi tiết bài viết: " + ex.Message);
                    }
                    break;
                }
            }
            Thread.Sleep(1000);
            FillPostTitle(title);
            Thread.Sleep(1000);
            FillPostContent(newContent);
            Thread.Sleep(1000);
            PublishPost();
        }

        public bool IsPostUpdated()
        {
            try
            {
                var confirmationMessage = _driver.FindElement(By.CssSelector(".notice-success"));
                return confirmationMessage.Text.Contains("Bài viết đã được cập nhật");
            }
            catch (NoSuchElementException)
            {
                return false;
            }
        }

        public void GoToCategoryPage()
        {
            _driver.Navigate().GoToUrl("http://localhost/test/wp-admin/edit-tags.php?taxonomy=category");
        }
        public void CreateNewCategory(string? cateName = null, string? path = null, string? desc = null)
        {
            if (!string.IsNullOrEmpty(cateName))
            {
                var nameInput = _driver.FindElement(By.Id("tag-name"));
                nameInput.Clear();
                nameInput.SendKeys(cateName);
            }
            
            if(!string.IsNullOrEmpty(path))
            {
                var pathInput = _driver.FindElement(By.Id("tag-slug"));
                pathInput.Clear();
                pathInput.SendKeys(path);
            }
            if(!string.IsNullOrEmpty(desc))
            {
                var descInput = _driver.FindElement(By.Id("tag-description"));
                descInput.Clear();
                descInput.SendKeys(desc);
            }
            var addBtn = _driver.FindElement(By.Id("submit"));
            addBtn.Click();
        }


        public void EditTagCategory(string? cateName = null, string? path = null, string? desc = null)
        {
            if (!string.IsNullOrEmpty(cateName))
            {
                var nameInput = _driver.FindElement(By.Id("name"));
                nameInput.Clear();
                nameInput.SendKeys(cateName);
            }

            if (!string.IsNullOrEmpty(path))
            {
                var pathInput = _driver.FindElement(By.Id("slug"));
                pathInput.Clear();
                pathInput.SendKeys(path);
            }
            if (!string.IsNullOrEmpty(desc))
            {
                var descInput = _driver.FindElement(By.Id("description"));
                descInput.Clear();
                descInput.SendKeys(desc);
            }
            var addBtn = _driver.FindElement(By.CssSelector("input[type='submit']"));
            addBtn.Click();
        }


        public bool IsCategoryCreated()
        {
            try
            {
                var confirmationMessage = _driver.FindElement(By.CssSelector(".notice-success"));
                return confirmationMessage.Text.Contains("Chuyên mục đã được thêm.");
            }
            catch (NoSuchElementException)
            {
                return false;
            }
        }

        public bool IsTagCreated()
        {
            try
            {
                var confirmationMessage = _driver.FindElement(By.CssSelector(".notice-success"));
                return confirmationMessage.Text.Contains("Thẻ đã được thêm vào.");
            }
            catch (NoSuchElementException)
            {
                return false;
            }
        }

        public bool IsCategoryCreateEmptyCtg()
        {
            try
            {
                var confirmationMessage = _driver.FindElement(By.CssSelector(".notice-error"));
                return confirmationMessage.Text.Contains("Yêu cầu nhập tên cho điều kiện này.");
            }
            catch (NoSuchElementException)
            {
                return false;
            }
        }


        public bool IsCategoryCreateDupCtg()
        {
            try
            {
                var confirmationMessage = _driver.FindElement(By.CssSelector(".notice-error"));
                return confirmationMessage.Text.Contains("Thẻ này đã được sử dụng.");
            }
            catch (NoSuchElementException)
            {
                return false;
            }
        }

        public bool IsTagCreateDupCtg()
        {
            try
            {
                var confirmationMessage = _driver.FindElement(By.CssSelector(".notice-error"));
                return confirmationMessage.Text.Contains("Tên này đã tồn tại rồi, không dùng được");
            }
            catch (NoSuchElementException)
            {
                return false;
            }
        }

        public void GoToTagPage()
        {
            _driver.Navigate().GoToUrl("http://localhost/test/wp-admin/edit-tags.php?taxonomy=post_tag");
        }


        public void DeleteCategory(string categoryName)
        {
            var rows = _driver.FindElements(By.CssSelector("#the-list tr"));
            foreach (var row in rows)
            {
                if (row.Text.Contains(categoryName, StringComparison.OrdinalIgnoreCase))
                {
                    Actions action = new Actions(_driver);
                    action.MoveToElement(row).Perform();

                    var deleteLink = row.FindElement(By.CssSelector(".row-actions .delete-tag"));
                    var jsExecutor = (IJavaScriptExecutor)_driver;
                    jsExecutor.ExecuteScript("arguments[0].click();", deleteLink);
                    Thread.Sleep(1000);
                    _driver.SwitchTo().Alert().Accept(); 
                    break;
                }
            }
        }

        public bool IsCategoryExists(string categoryName)
        {
            var rows = _driver.FindElements(By.CssSelector("#the-list tr"));
            foreach (var row in rows)
            {
                if (row.Text.Contains(categoryName, StringComparison.OrdinalIgnoreCase))
                {
                    return true;
                }
            }
            return false;
        }

        public bool IsUpdate()
        {
            try
            {
                var confirmationMessage = _driver.FindElement(By.CssSelector(".notice-success"));
                return confirmationMessage.Text.Contains("Thẻ đã được cập nhật.");
            }
            catch (NoSuchElementException)
            {
                return false;
            }
        }

        public void EditTag(string oldTile, string? tagName = null, string? path = null, string? desc = null)
        {
            var rows = _driver.FindElements(By.CssSelector("tbody#the-list tr"));

            foreach (var row in rows)
            {
                Console.WriteLine("ROW TEXT: " + row.Text);

                if (row.Text.ToLower().Contains(oldTile.ToLower()))
                {
                    try
                    {
                        var titleLink = row.FindElement(By.CssSelector("a.row-title"));
                        ((IJavaScriptExecutor)_driver).ExecuteScript("arguments[0].scrollIntoView(true);", titleLink);
                        Thread.Sleep(300);
                        ((IJavaScriptExecutor)_driver).ExecuteScript("arguments[0].click();", titleLink);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("Không tìm thấy phần tử chi tiết bài viết: " + ex.Message);
                    }
                    break;
                }
            }

            Thread.Sleep(1000);
            EditTagCategory(tagName, path, desc);
        }
    }
}
