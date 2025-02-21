from locust import HttpUser, task, between

class User(HttpUser):
    @task
    def post_pdf(self):
        headers = { 'content-type': 'application/json' }

        # Users will target GetPDF_DFATest() function in pdf-service/Controllers/PDFController.cs
        response = self.client.post("/api/pdf/GetPDF_DFATest", headers=headers)
        
        # Verify if response returns 200, otherwise print unexpected HTTP status code.
        assert response.status_code == 200, f"Unexpected status code: {response.status_code}"
        
        # Print response details for debugging
        # print(response.text)
