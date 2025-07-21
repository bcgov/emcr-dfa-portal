using System;
using System.Linq;
using EMBC.Database.Contract;
using EMBC.Database.Resources;
using EMBC.Database.Shared.Contract;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.DFA.API.Controllers;

[Route("api/[Controller]")]
[ApiController]
[Authorize]
public class EventController : ControllerBase
{
    private readonly IEventRepository _eventRepository;

    public EventController(IEventRepository eventRepository)
    {
        _eventRepository = eventRepository ?? throw new ArgumentNullException(nameof(eventRepository));
    }

    [HttpGet("hasactiveevent")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public ActionResult<HasActiveEventResponse> HasActiveEvent()
    {
        var query = new EventQuery
        {
            StateCode = StateCode.Active,
            BeforeNinetyDeadline = DateTime.UtcNow,
            NotNullEventType = true
        };
        var events = _eventRepository
            .Query(query)
            .ToList();
        if (events == null || !events.Any())
        {
            return NoContent();
        }
        var response = new HasActiveEventResponse(
            HasActivePrivateEvent: events.Any(e => e.EventType == EventType.Private || e.EventType == EventType.PrivatePublic),
            HasActivePublicEvent: events.Any(e => e.EventType == EventType.Public || e.EventType == EventType.PrivatePublic)
        );
        return Ok(response);
    }
}

public record HasActiveEventResponse(bool HasActivePrivateEvent, bool HasActivePublicEvent);
